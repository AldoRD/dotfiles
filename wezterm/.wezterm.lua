local wezterm = require("wezterm")

local config = {}

if wezterm.config_builder then
	config = wezterm.config_builder()
end

-- config.color_scheme = "Solarized (dark) (terminal.sexy)"
-- config.color_scheme = "Catppuccin Mocha"
config.color_scheme = "Tokyo Night Storm"

config.term = "xterm-256color"
config.colors = {
	background = "#181616",
}
config.bold_brightens_ansi_colors = true

config.font = wezterm.font("Mononoki Nerd Font")
config.font_size = 14.0

config.force_reverse_video_cursor = true
config.automatically_reload_config = true
config.window_close_confirmation = "NeverPrompt"
config.hide_tab_bar_if_only_one_tab = true
config.default_domain = "WSL:Ubuntu"
config.max_fps = 200
config.animation_fps = 200

config.mouse_bindings = {
	{
		event = { Down = { streak = 1, button = "Left" } },
		mods = "ALT",
		action = "StartWindowDrag",
		mouse_reporting = true,
	},
}

config.window_background_opacity = 0.75
config.win32_system_backdrop = "Acrylic"
config.window_decorations = "RESIZE"
config.front_end = "OpenGL"

return config
