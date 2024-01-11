import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { v4 as uuidv4 } from "uuid";
import LichessPgnViewer from "lichess-pgn-viewer";

interface PgnViewerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PgnViewerSettings = {
	mySetting: "default",
};

export default class PgnViewer extends Plugin {
	settings: PgnViewerSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("pgn", this.draw_diagram());

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PgnSettingsTab(this.app, this));
	}

	private draw_diagram() {
		return (source: string, el: HTMLElement) => {
			const boxWidth = "100%";
			const boxHeight = "100%";

			el.setAttributeNS(null, "width", String(boxWidth));
			el.setAttributeNS(null, "height", String(boxHeight));
			el.setAttributeNS(
				null,
				"style",
				"text-align: left;display: block;"
			);
			const id = "board" + uuidv4();
			// console.log(id);
			// console.log(source);

			const domElement = el.createDiv({ cls: "new-pgn-viewer" });
			const lpv = LichessPgnViewer(domElement, {
				pgn: source,
			});
		};
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PgnSettingsTab extends PluginSettingTab {
	plugin: PgnViewer;

	constructor(app: App, plugin: PgnViewer) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Settings Placeholder")
			.setDesc("Doesn't do anything yet")
			.addText((text) =>
				text
					.setPlaceholder("setting text goes here")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
