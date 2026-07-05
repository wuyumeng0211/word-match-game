// 视觉工具：字母块配色（Lab 色距选色）、粒子与飘分动画
Object.assign(WordMatchGame.prototype, {
    hexToLab(hex) {
        const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255);
        const linear = rgb.map(value => value > 0.04045
            ? Math.pow((value + 0.055) / 1.055, 2.4)
            : value / 12.92);
        const x = (linear[0] * 0.4124 + linear[1] * 0.3576 + linear[2] * 0.1805) / 0.95047;
        const y = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
        const z = (linear[0] * 0.0193 + linear[1] * 0.1192 + linear[2] * 0.9505) / 1.08883;
        const pivot = value => value > 0.008856 ? Math.cbrt(value) : (7.787 * value) + (16 / 116);
        const fx = pivot(x), fy = pivot(y), fz = pivot(z);
        return { l:(116 * fy) - 16, a:500 * (fx - fy), b:200 * (fy - fz) };
    },

    colorDistance(left, right) {
        const a = this.hexToLab(left), b = this.hexToLab(right);
        return Math.sqrt(
            Math.pow(a.l - b.l, 2) +
            Math.pow(a.a - b.a, 2) +
            Math.pow(a.b - b.b, 2)
        );
    },

    selectDistinctPalette(count, seedText) {
        let seed = this.hashString(seedText || 'word-match');
        const core = [...CORE_LETTER_COLORS];
        for (let i = core.length - 1; i > 0; i--) {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            const j = seed % (i + 1);
            [core[i], core[j]] = [core[j], core[i]];
        }
        const selected = core.slice(0, Math.min(count, core.length));
        const coreHex = new Set(CORE_LETTER_COLORS.map(color => color.bg));
        const remaining = LETTER_COLOR_PALETTE.filter(color => !coreHex.has(color.bg));
        while (selected.length < count && remaining.length > 0) {
            let bestIndex = 0;
            let bestScore = -1;
            remaining.forEach((candidate, index) => {
                const minDistance = Math.min(...selected.map(color => this.colorDistance(candidate.bg, color.bg)));
                if (minDistance > bestScore) {
                    bestIndex = index;
                    bestScore = minDistance;
                }
            });
            selected.push(remaining.splice(bestIndex, 1)[0]);
        }
        return selected;
    },

    buildLetterColorMap() {
        const letters = [...new Set(this.getLetterPool())].sort();
        const targetSet = new Set(this.targetWord.split(''));
        const ordered = [
            ...letters.filter(ch => targetSet.has(ch)),
            ...letters.filter(ch => !targetSet.has(ch))
        ];
        const palette = this.selectDistinctPalette(ordered.length, `${this.gameMode}-${this.level}-${this.targetWord}`);
        this.letterColorMap = {};
        ordered.forEach((letter, index) => {
            const color = palette[index];
            const previousColors = palette.slice(0, index);
            const nearestDistance = previousColors.length
                ? Math.min(...previousColors.map(previous => this.colorDistance(color.bg, previous.bg)))
                : Infinity;
            const needsPattern = nearestDistance < 52;
            const pattern = needsPattern
                ? LETTER_PATTERNS[(index % (LETTER_PATTERNS.length - 1)) + 1]
                : '';
            this.letterColorMap[letter] = { ...color, pattern };
        });
    },

    applyTileColor(tile, letter) {
        const color = this.letterColorMap[letter] || LETTER_COLOR_PALETTE[0];
        const gradient = `linear-gradient(135deg, ${color.bg} 0%, ${color.bg2} 100%)`;
        const fallbackPattern = LETTER_PATTERNS[(Math.max(0, letter.charCodeAt(0) - 65) % (LETTER_PATTERNS.length - 1)) + 1];
        const pattern = this.colorBlindMode ? fallbackPattern : color.pattern;
        const background = pattern ? `${pattern}, ${gradient}` : gradient;
        tile.style.setProperty('background', background, 'important');
        tile.style.color = color.fg;
        tile.style.border = `2px solid ${color.border}`;
        tile.style.textShadow = '0 1px 2px rgba(0,0,0,0.28)';
    },

    spawnParticles(x, y, color) {
        if (this.reduceMotion) return;
        const container = document.getElementById('boardContainer');
        const effect = this.equippedEffect;
        const count = effect === 'rainbow_effect' ? 12 : 8;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.position = 'absolute';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '40';
            const angle = (Math.PI * 2 * i) / count;
            const dist = 30 + Math.random() * 30;
            p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            if (effect === 'star_effect') {
                p.innerHTML = '⭐';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 0.8s ease forwards';
            } else if (effect === 'heart_effect') {
                p.innerHTML = '💗';
                p.style.fontSize = '14px';
                p.style.animation = 'particleBurst 1s ease forwards';
            } else if (effect === 'paper_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '5px';
                p.style.borderRadius = '0';
                p.style.background = ['#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#feca57'][i % 5];
                p.style.animation = 'particleBurst 1.2s ease forwards';
            } else if (effect === 'rainbow_effect') {
                p.className = 'particle';
                p.style.width = '8px';
                p.style.height = '8px';
                p.style.borderRadius = '50%';
                p.style.background = `hsl(${(i * 360 / count)},80%,60%)`;
                p.style.transition = 'transform 0.3s, opacity 0.3s';
                p.style.animation = 'particleBurst 1s ease forwards';
                p.style.filter = 'drop-shadow(0 0 4px currentColor)';
            } else {
                p.className = 'particle';
                p.style.background = color;
                p.style.animation = 'particleBurst 0.8s ease forwards';
            }
            container.appendChild(p);
            setTimeout(() => p.remove(), effect === 'paper_effect' ? 1200 : 1000);
        }
    },

    spawnScorePopup(x, y, score) {
        const container = document.getElementById('boardContainer');
        const el = document.createElement('div');
        el.className = 'score-popup';
        el.textContent = '+' + Math.round(score);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    spawnConfetti(host) {
        if (this.reduceMotion || !host) return;
        const colors = ['#ff4081','#ff9800','#ffeb3b','#4caf50','#00e5ff','#7c4dff','#ffd700'];
        for (let i = 0; i < 26; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[i % colors.length];
            piece.style.animationDuration = (1.1 + Math.random() * 1.1) + 's';
            piece.style.animationDelay = (Math.random() * 0.35) + 's';
            host.appendChild(piece);
            setTimeout(() => piece.remove(), 2800);
        }
    }
});
