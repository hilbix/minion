#!/bin/bash
#
# Create minion.ico from minion.png

# See https://askubuntu.com/a/1365053/164798
exec convert minion.png -define icon:auto-resize=256,64,48,32,16 minion.ico

