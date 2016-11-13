import {RenderController} from "./render";

export interface Input {
    totalLines: number,
    multiplier: number,
    animate: boolean,
    multiplierIncrement: number,
    opacity: number,
    colorMethod: string,
    camPosX: number,
    camPosY: number,
    camPosZ: number
}

export function initGUI(input: Input, renderController: RenderController) {
    let gui = new dat.GUI();

    const totalLines = "totalLines";
    const multiplier = "multiplier";
    const animate = "animate";
    const multiplierIncrement = "multiplierIncrement";
    const opacity = "opacity";
    const colorMethod = "colorMethod";
    const camPosX = "camPosX";
    const camPosY = "camPosY";
    const camPosZ = "camPosZ";

    let f1 = gui.addFolder("Maths");
    f1.add(input, totalLines).min(0).step(1)
        .onChange(() => renderController.requestRender(totalLines));
    f1.add(input, "multiplier").step(1)
        .onChange(() => renderController.requestRender(multiplier));
    f1.open();

    let f2 = gui.addFolder("Animation");
    f2.add(input, animate)
        .onChange(() => renderController.requestRender(animate));
    f2.add(input, multiplierIncrement).min(-1).max(1).step(0.001)
        .onChange(() => renderController.requestRender(multiplierIncrement));
    f2.open();

    let f3 = gui.addFolder("Color");
    f3.add(input, opacity, 0, 1).step(0.001)
        .onChange(() => renderController.requestRender(opacity));
    f3.add(input, colorMethod, ['solid', 'faded', 'length'])
        .onChange(() => renderController.requestRender(colorMethod));
    f3.open();

    let f4 = gui.addFolder("Camera");
    f4.add(input, camPosX, -1, 1)
        .onChange(() => renderController.requestRender(camPosX));
    f4.add(input, camPosY, -1, 1)
        .onChange(() => renderController.requestRender(camPosY));
    f4.add(input, camPosZ, 0, 1).step(0.01)
        .onChange(() => renderController.requestRender(camPosZ));

}
