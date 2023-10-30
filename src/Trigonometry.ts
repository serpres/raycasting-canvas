class Trigonometry {
    static toRadians(deg: number) {
        return (deg * Math.PI) / 180;
    }
    static calculateHypotenuse({
        x1,
        y1,
        x2,
        y2,
    }: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}

export { Trigonometry };
