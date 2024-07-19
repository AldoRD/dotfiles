local wezterm = require("wezterm")

local config = {}

if wezterm.config_builder then
	config = wezterm.config_builder()
end

-- config.color_scheme = "Solarized (dark) (terminal.sexy)"
-- config.color_scheme = "Catppuccin Mocha"
config.color_scheme = "Tokyo Night Storm"

config.term = "xterm-256color"
config.bold_brightens_ansi_colors = true
config.colors = {
	background = "#181616",
}

config.font = wezterm.font("Mononoki Nerd Font")
config.font_size = 16.0

config.disable_default_key_bindings = true
config.force_reverse_video_cursor = true
config.automatically_reload_config = true
config.adjust_window_size_when_changing_font_size = false
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

config.keys = {
	{
		key = "p",
		mods = "SHIFT | CTRL",
		action = wezterm.action.ActivateCommandPalette,
	},
	{ key = "=", mods = "CTRL", action = wezterm.action.IncreaseFontSize },
	{ key = "-", mods = "CTRL", action = wezterm.action.DecreaseFontSize },
	{ key = "0", mods = "CTRL", action = wezterm.action.ResetFontSize },
}

config.window_background_opacity = 0.75
config.win32_system_backdrop = "Acrylic"
config.window_decorations = "RESIZE"
config.front_end = "OpenGL"

return config
