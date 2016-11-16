#!/bin/sh

p_string="\033[1;2mpre-commit:\033[m"
staged_files=($(git diff --cached --name-only | grep -E '\.(js|jsx)$'))

if [[ "$staged_files" = "" ]]; then
  echo "\n$p_string No staged .js|.jsx files, ESLint not run"
  exit 0
fi

echo "\n$p_string Running ESLint against staged files\n"

for file in $staged_files
do
  git show ":$file" | node_modules/.bin/eslint --stdin --stdin-filename "$file" # we only want to lint the staged changes, not any un-staged changes
  if [ $? -ne 0 ]; then
    echo "$p_string Commit aborted."
    echo "$p_string ESLint failed on staged file '$file'."
    echo "$p_string Please check your code and try again."
    echo "$p_string You can run ESLint manually via 'npm run lint:staged'\n"
    exit 1 # exit with failure status
  fi
   echo "$p_string ESLint succeeded.\n"
done

exit $?
