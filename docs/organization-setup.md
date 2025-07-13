# GitHub Organization Setup for Docker Builds

## Issue Resolution

The Docker build failure was caused by missing permissions to create packages in the GitHub Container Registry (GHCR) for the organization.

## What We Fixed

1. **Added explicit permissions** to the CI/CD workflow:
   - `contents: read` - Read repository contents
   - `packages: write` - Write to GitHub Container Registry
   - `security-events: write` - Write security scan results

2. **Conditional Docker pushes** - Only push images on pushes to main/dev branches, not on pull requests

## Organization Settings to Configure

### 1. Package Creation Permissions

1. Go to your GitHub organization: https://github.com/rakshaayanplatform
2. Navigate to **Settings** → **Packages**
3. Ensure **Package creation** is enabled for organization members
4. Set **Package access control and permissions** as needed

### 2. Repository Permissions

1. Go to the repository: https://github.com/rakshaayanplatform/mvpi-regulatory-platform
2. Navigate to **Settings** → **Actions** → **General**
3. Ensure **Workflow permissions** are set to:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### 3. Organization Member Permissions

1. Go to organization settings: https://github.com/rakshaayanplatform
2. Navigate to **Settings** → **Member privileges**
3. Ensure team members have appropriate permissions:
   - **Write** access to repositories
   - **Package creation** permissions

## Alternative Solutions

If organization-level package creation is restricted, you can:

### Option 1: Use Personal Access Token
1. Create a Personal Access Token with `write:packages` scope
2. Add it as a repository secret: `CR_PAT`
3. Update the workflow to use the token:

```yaml
- name: Log in to Container Registry
  uses: docker/login-action@v3
  if: github.event_name != 'pull_request'
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.CR_PAT }}
```

### Option 2: Use Docker Hub
1. Create a Docker Hub account
2. Add Docker Hub credentials as secrets
3. Update the workflow to push to Docker Hub instead

### Option 3: Build Only (No Push)
1. Remove push steps entirely
2. Only build images locally for testing
3. Push manually when needed

## Current Status

The workflow has been updated with proper permissions. The next push to main/dev branches should successfully build and push Docker images to GHCR.

## Testing the Fix

1. Merge the current PR to dev branch
2. Push a commit to dev branch
3. Check if Docker builds succeed in the Actions tab

## Troubleshooting

If issues persist:

1. Check organization package settings
2. Verify repository permissions
3. Review GitHub Actions logs for specific error messages
4. Consider using alternative container registries

## Next Steps

1. ✅ Fix workflow permissions
2. ✅ Update conditional push logic
3. 🔄 Test with next push to dev/main
4. 🔄 Configure organization settings if needed
5. 🔄 Set up deployment pipeline 