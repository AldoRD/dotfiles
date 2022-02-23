#!/bin/bash

killall -q polybar

hdmi=`xrandr | grep ' connected' | grep 'HDMI-A-0' | awk '{print $1}'`

if [ "$hdmi" = "HDMI-A-0" ]; then
  polybar --reload  primary 2>&1  | tee -a /tmp/polybar1.log & disown
  polybar --reload secondary 2>&1  | tee -a /tmp/polybar2.log & disown
else
  polybar --reload  primary 2>&1  | tee -a /tmp/polybar1.log & disown
fi

echo "Bars launched..."

