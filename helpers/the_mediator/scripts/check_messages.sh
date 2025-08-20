#!/bin/bash

# This script checks for new messages in a helper's inbox.

RECIPIENT=$1

if [ -z "$RECIPIENT" ]; then
  echo "Usage: $0 <recipient>"
  exit 1
fi

INBOX_DIR="/home/user/Github/tatwats/helpers/the_mediator/common_room/$RECIPIENT/inbox"

if [ ! -d "$INBOX_DIR" ]; then
  echo "Error: Inbox for $RECIPIENT not found."
  exit 1
fi

MESSAGES=$(ls -1 "$INBOX_DIR")

if [ -z "$MESSAGES" ]; then
  echo "No new messages for $RECIPIENT."
else
  echo "New messages for $RECIPIENT:"
  for message in $MESSAGES; do
    echo "- $message"
  done
fi
