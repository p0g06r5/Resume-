The repository has no .gitmodules file at the checked commit; the git post-job error comes from a stale submodule reference in remote history or local runner state. To fix CI noise, remove any submodule references by ensuring the repo has no submodule entries. If you want to re-add submodules, add a .gitmodules file with the correct entries.

I cannot modify repository git metadata from the runner safely without confirmation of the correct submodule URL. Please run locally:

# If submodule is not needed
git rm --cached portfolio-ai-worker/pawan-portfolio-ai || true
rm -rf .git/modules/portfolio-ai-worker/pawan-portfolio-ai || true
# Remove any leftover entry in .gitmodules if present
# Commit and push changes

git add -A
git commit -m "Remove stale broken submodule reference"
git push

Alternatively, if the submodule is required, add a .gitmodules file with the correct path and url entries and push that commit.
