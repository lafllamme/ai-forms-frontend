#!/bin/bash

# Define color codes
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
RESET="\033[0m"
BOLD="\033[1m"

timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

echo -e "${BOLD}${CYAN}🧹 Cleaning Script Started at $(timestamp)${RESET}\n"

removed_any=0

remove_dir() {
  if [ -d "$1" ]; then
    rm -rf "$1"
    echo -e "  ${GREEN}✅ Removed directory: $1${RESET}"
    removed_any=1
  else
    echo -e "  ${YELLOW}⚠️  Directory not found: $1${RESET}"
  fi
}

remove_file() {
  if [ -f "$1" ]; then
    rm "$1"
    echo -e "  ${GREEN}✅ Removed file: $1${RESET}"
    removed_any=1
  else
    echo -e "  ${YELLOW}⚠️  File not found: $1${RESET}"
  fi
}

remove_dir "node_modules"
remove_dir ".nuxt"
remove_dir ".output"
remove_dir ".data"
remove_dir "build"
remove_dir ".pnpm-store"
remove_dir ".npm"

remove_file "package-lock.json"
# Uncomment if you want to remove pnpm-lock.yaml too
# remove_file "pnpm-lock.yaml"

if [ $removed_any -eq 1 ]; then
  echo -e "\n${GREEN}✨ All specified directories and files cleaned!${RESET}"
else
  echo -e "\n${YELLOW}🟡 Nothing to clean. All files/directories already removed.${RESET}"
fi

echo -e "${BOLD}${CYAN}🏁 Cleaning Finished at $(timestamp)${RESET}\n"
