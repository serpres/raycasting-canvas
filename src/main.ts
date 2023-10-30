import { Canvas } from "./Canvas";
import { Trigonometry } from "./Trigonometry";

import { Ray } from "./types";

class App extends Canvas {
    cellSize: number;
    map: number[][];
    scene: HTMLCanvasElement;
    camera: {
        x: number;
        y: number;
        angle: number;
        speed: number;
        size: number;
        fieldOfView: number;
    };
    constructor(scene: HTMLCanvasElement) {
        super(scene);
        this.scene = scene;
        this.cellSize = 64;
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        this.camera = {
            x: this.cellSize * 2,
            y: this.cellSize * 2,
            angle: 0,
            speed: 0,
            size: 10,
            fieldOfView: Trigonometry.toRadians(60),
        };
    }
    renderScene(rays: Ray[]) {
        rays.forEach(({ distance, vertical, angle }, i) => {
            distance = distance * Math.cos(angle - this.camera.angle);
            const wallHeight = ((this.cellSize * 5) / distance) * 277;
            // Walls
            this.rect({
                x: i,
                y: this.scene.height / 2 - wallHeight / 2,
                w: 1,
                h: wallHeight,
                color: vertical ? this.colors.dark : this.colors.light,
            });
            // Floor
            this.rect({
                x: i,
                y: this.scene.height / 2 + wallHeight / 2,
                w: 1,
                h: this.scene.height / 2 - wallHeight / 2,
                color: this.colors.green,
            });
            // Ceiling
            this.rect({
                x: i,
                y: 0,
                w: 1,
                h: this.scene.height / 2 - wallHeight / 2,
                color: this.colors.blue,
            });
        });
    }
    isOutOfMapBounds(x: number, y: number) {
        return (
            x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length
        );
    }
    getHCollision(angle: number) {
        const up = Math.abs(Math.floor(angle / Math.PI) % 2);
        const firstY = up
            ? Math.floor(this.camera.y / this.cellSize) * this.cellSize
            : Math.floor(this.camera.y / this.cellSize) * this.cellSize +
              this.cellSize;
        const firstX =
            this.camera.x + (firstY - this.camera.y) / Math.tan(angle);

        const yA = up ? -this.cellSize : this.cellSize;
        const xA = yA / Math.tan(angle);

        let wall;
        let nextX = firstX;
        let nextY = firstY;
        while (!wall) {
            const cellX = Math.floor(nextX / this.cellSize);
            const cellY = up
                ? Math.floor(nextY / this.cellSize) - 1
                : Math.floor(nextY / this.cellSize);

            if (this.isOutOfMapBounds(cellX, cellY)) {
                break;
            }

            wall = this.map[cellY][cellX];
            if (!wall) {
                nextX += xA;
                nextY += yA;
            }
        }
        return {
            angle,
            distance: Trigonometry.calculateHypotenuse({
                x1: this.camera.x,
                x2: nextX,
                y1: this.camera.y,
                y2: nextY,
            }),
            vertical: false,
        };
    }
    getVCollision(angle: number) {
        const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

        const firstX = right
            ? Math.floor(this.camera.x / this.cellSize) * this.cellSize +
              this.cellSize
            : Math.floor(this.camera.x / this.cellSize) * this.cellSize;

        const firstY =
            this.camera.y + (firstX - this.camera.x) * Math.tan(angle);

        const xA = right ? this.cellSize : -this.cellSize;
        const yA = xA * Math.tan(angle);

        let wall;
        let nextX = firstX;
        let nextY = firstY;

        while (!wall) {
            const cellX = right
                ? Math.floor(nextX / this.cellSize)
                : Math.floor(nextX / this.cellSize) - 1;
            const cellY = Math.floor(nextY / this.cellSize);

            if (this.isOutOfMapBounds(cellX, cellY)) {
                break;
            }
            wall = this.map[cellY][cellX];
            if (!wall) {
                nextX += xA;
                nextY += yA;
            }
        }
        return {
            angle,
            distance: Trigonometry.calculateHypotenuse({
                x1: this.camera.x,
                x2: nextX,
                y1: this.camera.y,
                y2: nextY,
            }),
            vertical: true,
        };
    }
    castRay(angle: number) {
        const vCollision = this.getVCollision(angle);
        const hCollision = this.getHCollision(angle);
        return hCollision.distance >= vCollision.distance
            ? vCollision
            : hCollision;
    }
    getRays() {
        const initialAngle = this.camera.angle - this.camera.fieldOfView / 2;
        const raysCount = this.scene.width;
        const angleStep = this.camera.fieldOfView / raysCount;
        return Array.from({ length: raysCount }, (_, i) => {
            const angle = initialAngle + i * angleStep;
            return this.castRay(angle);
        });
    }
    renderMinimap({
        posX = 0,
        posY = 0,
        scale = 1,
        rays,
    }: {
        posX: number;
        posY: number;
        scale: number;
        rays: Ray[];
    }) {
        const mapCellSize = scale * this.cellSize;
        // Walls
        this.map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.rect({
                        x: posX + x * mapCellSize,
                        y: posY + y * mapCellSize,
                        w: mapCellSize,
                        h: mapCellSize,
                        color: this.colors.grey,
                    });
                }
            });
        });
        // Rays
        rays.forEach((ray) => {
            this.line({
                x1: this.camera.x * scale + posX,
                y1: this.camera.y * scale + posY,
                x2:
                    (this.camera.x + Math.cos(ray.angle) * ray.distance) *
                        scale +
                    posX,
                y2:
                    (this.camera.y + Math.sin(ray.angle) * ray.distance) *
                        scale +
                    posY,
                color: this.colors.yellow,
            });
        });
        // Player
        this.circle({
            x: posX + this.camera.x * scale,
            y: posY + this.camera.y * scale,
            r: this.camera.size / 2,
            color: this.colors.orange,
        });
    }
    setCameraMove(key: string, eventType: "keyup" | "keydown") {
        if (key === "w" || key === "ArrowUp") {
            eventType === "keydown"
                ? (this.camera.speed = 2)
                : (this.camera.speed = 0);
        }
        if (key === "s" || key === "ArrowDown") {
            eventType === "keydown"
                ? (this.camera.speed = -2)
                : (this.camera.speed = 0);
        }
    }
    cameraMove() {
        this.camera.x += Math.cos(this.camera.angle) * this.camera.speed;
        this.camera.y += Math.sin(this.camera.angle) * this.camera.speed;
    }
    cameraRotation(angle: number) {
        this.camera.angle += Trigonometry.toRadians(angle);
    }
    render() {
        this.clear();
        const rays = this.getRays();
        this.cameraMove();
        this.renderScene(rays);
        this.renderMinimap({ posX: 10, posY: 30, scale: 0.3, rays });
    }
    exec() {
        this.render();
        requestAnimationFrame(this.exec.bind(this));
    }
}

const scene = document.createElement("canvas");
scene.width = window.innerWidth;
scene.height = window.innerHeight;

const app = new App(scene);
app.exec();

document.addEventListener("keydown", ({ key }) => {
    app.setCameraMove(key, "keydown");
});
document.addEventListener("keyup", ({ key }) => {
    app.setCameraMove(key, "keyup");
});
document.addEventListener("mousemove", ({ movementX }) => {
    app.cameraRotation(movementX);
});

const container = document.getElementById("app");
container?.appendChild(scene);
