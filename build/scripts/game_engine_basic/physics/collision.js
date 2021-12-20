// Note x measures horizontal offset, y measures vertical offset
// 0,0 is top left if direction needs to be taken
// this preferably should be coordinate system independent (direction independent)
export function vector_length_sqr(...x) {
    let r = 0;
    for (const i of x) {
        r += i * i;
    }
    return r;
}
export function vector_length(...x) {
    return Math.sqrt(vector_length_sqr(...x));
}
export function distance(x0, y0, x1, y1) {
    return vector_length(x0 - x1, y0 - y1);
}
/**
 * Check if Point is inside circle
 * @param x
 * @param y
 * @param r
 * @param px
 * @param py
 * @returns
 */
export function IsPointInCircle(x, y, r, px, py) {
    return vector_length(x - px, y - py) <= r;
}
/**
 * Check if Point is inside rectange where a Rectange is defined by its top left corner
 * @param x
 * @param y
 * @param width
 * @param height
 * @param px
 * @param py
 * @returns
 */
export function IsPointInRectange(x, y, width, height, px, py) {
    let dx = px - x;
    let dy = py - y;
    return (0 <= dx) && (dx <= width) && (0 <= dy) && (dy <= height);
}
/**
 * Check if circle overlaps circle
 * @param x0
 * @param y0
 * @param r0
 * @param x1
 * @param y1
 * @param r1
 * @returns
 */
export function IsCircleInCircle(x0, y0, r0, x1, y1, r1) {
    return vector_length(x0 - x1, y0 - y1) <= r0 + r1;
}
/**
 * Check if Line intersects circle
 * @param x
 * @param y
 * @param r
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns
 */
export function IsLineInCircle(x, y, r, x0, y0, x1, y1) {
    let d = vector_length_sqr(x1 - x0, y1 - y0);
    let m = x0 * y1 - x1 * y0;
    let t = r * r * d - m * m;
    return t <= 0;
}
