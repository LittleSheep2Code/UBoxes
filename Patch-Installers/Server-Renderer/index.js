const AdmZip = require("adm-zip")
const Path = require("path")
const AppData = require("appdata-path")
const FsA = require("fs-extra")
const { exit } = require("process")

if(!FsA.existsSync("renderer-server.zip")) {
    console.error("[INSTALLER] Cannot found require install package!")
    exit()
}
    
const objective = Path.join(AppData(), "UBoxes")
console.log("[INSTALLER] Patch will install at: " + objective)

if(!FsA.existsSync(objective)) {
    console.warn("[INSTALLER] Patch install objective folder is not exist, auto create")
    FsA.mkdirsSync(objective)
}

console.log("[INSTALLER] Installing, please stand by...")
const patch_file = AdmZip("renderer-server.zip")
patch_file.extractAllTo(objective, true)

console.log("[INSTALLER] Installed! Restart UBoxes to load this patch!")


