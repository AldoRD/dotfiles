local M = {}

function M.get_colors_current_theme()
  local colorscheme = vim.g.colors_name
  local active_colors = {}
  local inactive_colors = {}

  if colorscheme == "tokyonight-night" then
    local colors = require("tokyonight.colors").setup()
    active_colors = {
      guibg = colors.magenta,
      guifg = colors.bg,
    }
    inactive_colors = {
      guibg = colors.bg,
      guifg = colors.fg,
    }
  end

  if colorscheme == "solarized-osaka" then
    local colors = require("solarized-osaka.colors").setup()
    active_colors = {
      guibg = colors.magenta500,
      guifg = colors.base04,
    }
    inactive_colors = {
      guibg = colors.base03,
      guifg = colors.violet500,
    }
  end

  if colorscheme == "catppuccin-mocha" then
    local colors = require("catppuccin.palettes").get_palette("mocha")
    active_colors = {
      guibg = colors.mauve,
      guifg = colors.base,
    }
    inactive_colors = {
      guibg = colors.bg,
      guifg = colors.text,
    }
  end

  return {
    active_colors = active_colors,
    inactive_colors = inactive_colors,
  }
end

return M
