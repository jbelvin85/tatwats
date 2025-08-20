#!/bin/bash

# This script reads the content of a message.

RECIPIENT=$1
MESSAGE_ID=$2

if [ -z "$RECIPIENT" ] || [ -z "$MESSAGE_ID" ]; then
  echo "Usage: $0 <recipient> <message_id>"
  exit 1
fi

MESSAGE_FILE="/home/user/Github/tatwats/helpers/the_mediator/common_room/$RECIPIENT/inbox/$MESSAGE_ID"

if [ ! -f "$MESSAGE_FILE" ]; then
  echo "Error: Message not found."
  exit 1
fi

cat "$MESSAGE_FILE"
