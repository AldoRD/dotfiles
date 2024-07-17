return {
  {
    "folke/flash.nvim",
    keys = {
      -- disable the default flash keymap
      { ";", mode = { "n", "x", "o" }, false },
      { "f", mode = { "n", "x", "o" }, false },
    },
  },
  {
    "dinhhuy258/git.nvim",
    event = "BufReadPre",
    opts = {
      keymaps = {
        -- Open blame window
        blame = "<Leader>gb",
        -- Open file/folder in git repository
        browse = "<Leader>go",
      },
    },
  },
  -- Edit explorer
  {
    "nvim-neo-tree/neo-tree.nvim",
    opts = {
      window = {
        width = 30,
      },
    },
  },
  -- Oil explorer
  {
    "stevearc/oil.nvim",
    opts = {
      view_options = {
        show_hidden = true,
      },
    },
    dependencies = { "nvim-tree/nvim-web-devicons" },
    keys = {
      { "<Space>oe", "<cmd>Oil<cr>", desc = "Oil Explorer" },
    },
  },
  {
    "brenoprata10/nvim-highlight-colors",
    lazy = true,
    priority = 1200,
    keys = {
      { "<Space>ch", "<cmd>HighlightColors Toggle<cr>", desc = "Highlight Colors" },
    },
    opts = {
      render = "background",
      enable_hex = true,
      enable_short_hex = true,
      enable_rgb = true,
      enable_hsl = true,
      enable_var_usage = true,
      enable_named_colors = true,
      enable_tailwind = false,
    },
  },
}
