import { DEngineClientV2, getEngine } from "@dendronhq/engine-server";
import * as path from "path";
import * as vscode from "vscode";
import _ = require("lodash");

export class DendronWorkspace {
  static _EngineWrapper: DendronWorkspace | undefined;
  engine: DEngineClientV2 | undefined;

  static getOrCreate() {
    let justInitialized = false;
    if (!this._EngineWrapper) {
      this._EngineWrapper = new DendronWorkspace();
      justInitialized = true;
    }
    return { justInitialized, ws: this._EngineWrapper };
  }

  async getOrCreateEngine() {
    if (!this.engine) {
      this.engine = await this.getEngine();
    }
    return this.engine;
  }

  async getEngine() {
    // DENDRON:START
    const wsRoot = path.dirname(vscode.workspace.workspaceFile.fsPath);
    const vaults = vscode.workspace.workspaceFolders.map((ent) => ({
      fsPath: ent.uri.fsPath,
    }));
    let dendronEngine: DEngineClientV2;
    //const version = WorkspaceService.getVersion({ wsRoot });
    //if (WorkspaceService.isNewVersionGreater({oldVersion: "0.15.0", newVersion: version})) {
    console.log("loading engine...");
    const { error, data } = await getEngine({ wsRoot, vaults });
    console.log("done loading...", error);
    if (_.isUndefined(error)) {
      console.log("load new engine");
      dendronEngine = data;
    } else {
      console.log("load old engine");
      dendronEngine = { vaults } as any;
    }
    this.engine = dendronEngine;
    return dendronEngine;
  }
}
