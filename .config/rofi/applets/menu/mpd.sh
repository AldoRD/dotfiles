#!/usr/bin/env bash

## Author  : Aditya Shakya
## Mail    : adi1090x@gmail.com
## Github  : @adi1090x
## Twitter : @adi1090x

style="$($HOME/.config/rofi/applets/menu/style.sh)"

dir="$HOME/.config/rofi/applets/menu/configs/$style"
rofi_command="rofi -theme $dir/mpd.rasi"

# Gets the current status of mpd (for us to parse it later on)
status="$(playerctl --player=vlc status)"
# Defines the Play / Pause option content
if [[ $status == "Playing" ]]; then
    play_pause=""
else
    play_pause=""
fi
active=""
urgent=""

repeat="$(playerctl --player=vlc loop)"

# Display if repeat mode is on / off
tog_repeat=""
if [[ $repeat == "Playlist" || $repeat == "Track" ]]; then
    active="-a 4"
elif [[ $repeat == "None" ]]; then
    urgent="-u 4"
else
    tog_repeat=""
fi

random="$(playerctl --player=vlc shuffle)"

# Display if random mode is on / off
tog_random=""
if [[ $random == *"On"* ]]; then
    [ -n "$active" ] && active+=",5" || active="-a 5"
elif [[ $random == *"Off"* ]]; then
    [ -n "$urgent" ] && urgent+=",5" || urgent="-u 5"
else
    tog_random=""
fi

stop=""
next=""
previous=""

# Variable passed to rofi
options="$previous\n$play_pause\n$stop\n$next\n$tog_repeat\n$tog_random"

# Get the current playing song
current=$(playerctl --player=vlc metadata --format '{{title}} - {{artist}}')
# If mpd isn't running it will return an empty string, we don't want to display that
if [[ -z "$current" ]]; then
    current="-"
fi

# Spawn the mpd menu with the "Play / Pause" entry selected by default
chosen="$(echo -e "$options" | $rofi_command -p "  $current" -dmenu $active $urgent -selected-row 1)"
case $chosen in
    $previous)
        playerctl --player=vlc previous && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{title}} - {{artist}}')"
        ;;
    $play_pause)
        playerctl --player=vlc play-pause && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{title}} - {{artist}}')"
        ;;
    $stop)
        playerctl --player=vlc stop
        ;;
    $next)
        playerctl --player=vlc next && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{title}} - {{artist}}')"
        ;;
    $tog_repeat)
        if [[ $repeat == *"None"* ]]; then
            playerctl --player=vlc loop Playlist && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{playerName}}'): Loop $(playerctl --player=vlc loop)"
        elif [[ $repeat == *"Playlist"* ]]; then
            playerctl --player=vlc loop Track && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{playerName}}'): Loop $(playerctl --player=vlc loop)"
        else
            playerctl --player=vlc loop None && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{playerName}}'): Loop $(playerctl --player=vlc loop)"
        fi
        ;;
    $tog_random)
        if [[ $random == 'Off' ]]; then
            playerctl --player=vlc shuffle On && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{playerName}}'): Random $(playerctl --player=vlc shuffle)"
        else 
            playerctl --player=vlc shuffle Off && notify-send -u low -t 1800 " $(playerctl --player=vlc metadata --format '{{playerName}}'): Random $(playerctl --player=vlc shuffle)"
        fi
        ;;
esac
