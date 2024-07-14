eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

set --unexport COLUMNS
set --unexport LINES

# Disable fish_greeting
set fish_greeting ""

# Alias
if type -q eza
    alias ls "eza -l -g --icons"
    alias ll "eza -l -g --icons"
    alias lla "ll -a"
    alias tree "eza -la --tree --level=3 --icons"
end

alias cat "bat --style=plain --paging=never"
alias rf "rm -rf"
alias grep "grep --color=auto"
alias vim nvim
alias svim "sudo nvim"
alias g git
alias update "sudo apt update && sudo apt upgrade -y && brew update && brew upgrade"
alias explorer "explorer.exe"
alias code code-insiders
alias lazy lazygit

# This is only if you use WSL and you want to access to windows files
alias windows "cd /mnt/c/Users/herna/Documentos/workspace/"

#Fzf
set fzf_fd_opts --hidden

# Starship
starship init fish | source

# Zoxide
zoxide init fish | source

# pnpm
set -gx PNPM_HOME "/home/aldord/.local/share/pnpm"
if not string match -q -- $PNPM_HOME $PATH
    set -gx PATH "$PNPM_HOME" $PATH
end

# Android
set -gx ANDROID_HOME /mnt/c/Users/herna/AppData/Local/Android/Sdk
set -gx WSLENV ANDROID_HOME/p

# Windows Path
set -gx WORK_WIN /mnt/c/Users/herna/

# Rust
source "$HOME/.cargo/env.fish"
