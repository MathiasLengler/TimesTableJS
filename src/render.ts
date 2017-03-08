import THREE = require("three");

import {ThreeEnv, Input, UpdateSource} from "./interfaces";
import {
  updateTotalLines,
  updateCameraPosition,
  updateOpacity,
  updateCameraZoom,
  updateMultiplier,
  updateRendererSize,
  updateColorMethod
} from "./updateActions";

class UpdateController {
  public updateTotalLines(){

  }
}

export class RenderController {
  private frameRequested = false;

  private readonly updateSources: Set<UpdateSource>;
  private readonly stats: Stats;
  private readonly threeEnv: ThreeEnv;
  private readonly input: Input;

  private static updateSourcesToActions = new Map<UpdateSource, Array<keyof UpdateController>>();

  constructor(stats: Stats, threeEnv: ThreeEnv, input: Input) {
    this.stats = stats;
    this.threeEnv = threeEnv;
    this.input = input;
    this.updateSources = new Set();
  }

  public requestRender(source: UpdateSource) {
    this.updateSources.add(source);

    if (!this.frameRequested) {
      this.frameRequested = true;
      requestAnimationFrame(() => this.render());
    }
  }

  private render() {
    this.stats.begin();

    this.frameRequested = false;

    this.update();

    this.threeEnv.renderer.render(this.threeEnv.scene, this.threeEnv.camera);

    this.prepareNextRender();

    this.stats.end();
  }

  private update() {
    if (this.updateSources.has("init")) {
      updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
      updateTotalLines(this.threeEnv, this.input.totalLines);
      updateColorMethod(this.threeEnv.material, this.input.colorMethod);
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateOpacity(this.threeEnv, this.input.opacity);
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("totalLines")) {
      updateTotalLines(this.threeEnv, this.input.totalLines);
    }

    if (this.updateSources.has("multiplier")) {
      updateMultiplier(this.threeEnv.material, this.input.multiplier);
    }

    if (this.updateSources.has("colorMethod")) {
      updateColorMethod(this.threeEnv.material, this.input.colorMethod);
    }

    if (this.updateSources.has("resetCamera")) {
      // TODO: update gui
      this.input.camPosX = 0;
      this.input.camPosY = 0;
      this.input.camZoom = 1;
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("camPosX") ||
      this.updateSources.has("camPosY")) {
      updateCameraPosition(this.threeEnv, this.input.camPosX, this.input.camPosY);
    }

    if (this.updateSources.has("camZoom")) {
      updateCameraZoom(this.threeEnv, this.input.camZoom);
    }

    if (this.updateSources.has("opacity")) {
      updateOpacity(this.threeEnv, this.input.opacity);
    }

    if (this.updateSources.has("resize")) {
      updateRendererSize(this.threeEnv, window.innerHeight, window.innerWidth);
    }
  }

  private prepareNextRender() {
    this.updateSources.clear();

    if (this.input.animate) {
      this.input.multiplier += Math.pow(this.input.multiplierIncrement, 3);
      this.requestRender("multiplier");
    }
  }
}
