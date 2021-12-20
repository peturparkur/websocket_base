import { vector_length } from "./collision";
export function CircleVsCircle(x0, y0, r0, x1, y1, r1) {
    let m = Math.max((r0 + r1) - vector_length(x0 - x1, y0 - y1), 0);
    return [(x1 - x0) * m, (y1 - y0) * m];
}
export function CircleVsPoint(x, y, r, px, py) {
    let m = Math.max(r - vector_length(px - x, py - y), 0);
    return [(px - x) * m, (py - y) * m];
}
