set --unexport COLUMNS
set --unexport LINES

set fish_greeting ""

# Alias
if type -q exa
  alias ls "exa -l -g --icons"
  alias ll "exa -l -g --icons"
  alias lla "ll -a"
end

alias cat  "bat --style=plain ---paging=never"
alias grep "grep --color=auto"
alias vim "nvim"
alias svim "sudo nvim"

# Exec
# neofetch

# Starship 
starship init fish | source

# FZF
set fzf_preview_dir_cmd exa --all --color=always --icons
set fzf_fd_opts --hidden --exclude=.git

# JAVA/Android-Studio
export _JAVA_AWT_WM_NONREPARENTING=1
