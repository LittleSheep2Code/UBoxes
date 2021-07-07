export default class PluginManifest {

  content = {}

  file_list = {
    "manifest": null,
    "resource": null
  }

  constructor(content, where) {
    this.content = content

    this.file_list.manifest = where
    this.file_list.resource = content["resource"]
  }
}
