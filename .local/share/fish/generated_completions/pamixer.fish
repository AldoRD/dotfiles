# pamixer
# Autogenerated from man page /usr/share/man/man1/pamixer.1.gz
complete -c pamixer -s h -l help -d 'br Show help message'
complete -c pamixer -l sink -d 'br Choose a different sink than the default'
complete -c pamixer -l source -d 'br Choose a different source than the default'
complete -c pamixer -l default-source -d 'br Select the default source'
complete -c pamixer -l get-volume -d 'br Get the current volume'
complete -c pamixer -l get-volume-human -d 'br Get the current volume percentage or the string "muted"'
complete -c pamixer -l set-volume -d 'br Set the volume'
complete -c pamixer -s i -l increase -d 'br Increase the volume'
complete -c pamixer -s d -l decrease -d 'br Decrease the volume'
complete -c pamixer -s t -l toggle-mute -d 'br Switch between mute and unmute'
complete -c pamixer -s m -l mute -d 'hr Set mute'
complete -c pamixer -l allow-boost -d 'br Allow volume to go above 100%'
complete -c pamixer -l gamma -d 'br Increase/decrease using gamma correction e. g.  2. 2'
complete -c pamixer -s u -l unmute -d 'br Unset mute'
complete -c pamixer -l get-mute -d 'br Display true if the volume is mute, false otherwise'
complete -c pamixer -l list-sinks -d 'br List the sinks'
complete -c pamixer -l list-sources

