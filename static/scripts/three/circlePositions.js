export default function keyCirclePositions(
    originX = new Number() ?? 0,
    originY = new Number() ?? 0,
    originZ = new Number() ?? 0,
    offsetAngle = new Number() ?? 0,
    radius = new Number() ?? 1,
    sectors = new Number(),
    arr = new Array(),
    inverse = new Boolean()
) {
    let angle = 360 / sectors;
    let angleWithOffset = angle + offsetAngle;
    let x = new Number();
    let y = new Number();
    let z = new Number();

    if (offsetAngle === 0 && inverse == false) {
        for (let i = 0; i < sectors; i++) {
            x = (originX + radius) * Math.sin(degToRad(angle * i));
            y = originY;
            z = (originZ + radius) * Math.cos(degToRad(angle * i));
            let coords = { x, y, z };
            arr.push(coords);
        }
    } else if (offsetAngle === 0 && inverse == true) {
        for (let i = 0; i < sectors; i++) {
            x = (originX + radius) * Math.sin(degToRad(angle * i)) * (-1);
            y = originY;
            z = (originZ + radius) * Math.cos(degToRad(angle * i)) * (-1);
            let coords = { x, y, z };
            arr.push(coords);
        }
    } else if (offsetAngle !== 0 && inverse == false) {
        for (let i = 1; i < sectors + 1; i++) {
            x = (originX + radius) * Math.sin(degToRad(angleWithOffset * i));
            y = originY;
            z = (originZ + radius) * Math.cos(degToRad(angleWithOffset * i));
            let coords = { x, y, z };
            arr.push(coords);
        }
    } else {
        for (let i = 1; i < sectors + 1; i++) {
            x = (originX + radius) * Math.sin(degToRad(angleWithOffset * i)) * (-1);
            y = originY;
            z = (originZ + radius) * Math.cos(degToRad(angleWithOffset * i)) * (-1);
            let coords = { x, y, z };
            arr.push(coords);
        }
    }

}

function degToRad(degrees) {
    return (degrees) * Math.PI/180;
};