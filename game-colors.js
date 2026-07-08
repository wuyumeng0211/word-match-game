// 视觉工具：字母块配色（Lab 色距选色）
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
    }
});
