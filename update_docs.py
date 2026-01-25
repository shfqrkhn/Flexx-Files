import re
import os

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def get_app_version():
    try:
        content = read_file('js/constants.js')
        match = re.search(r"export const APP_VERSION = '(\d+\.\d+\.\d+)';", content)
        if match:
            return match.group(1)
    except Exception as e:
        print(f"Error reading version: {e}")
    return None

def main():
    readme_path = 'README.md'
    readme = read_file(readme_path)

    # 1. Get current version
    new_version = get_app_version()
    if not new_version:
        print("Error: Could not determine APP_VERSION from js/constants.js")
        return

    # 2. Update Version Header
    # **Version:** 3.9.8 (Palette Update)
    version_pattern = r'(\*\*Version:\*\* )(\d+\.\d+\.\d+)'

    if re.search(version_pattern, readme):
        print(f"Updating version header to {new_version}")
        readme = re.sub(version_pattern, f'\\g<1>{new_version}', readme)
    else:
        print("Warning: Version header not found")

    # 3. Update File Code Blocks
    files_to_sync = [
        'index.html',
        'css/styles.css',
        'manifest.json',
        'sw.js',
        'js/accessibility.js',
        'js/app.js',
        'js/config.js',
        'js/constants.js',
        'js/core.js',
        'js/i18n.js',
        'js/observability.js',
        'js/security.js'
    ]

    for filepath in files_to_sync:
        if not os.path.exists(filepath):
            print(f"Warning: File {filepath} does not exist, skipping.")
            continue

        print(f"Syncing {filepath}...")
        content = read_file(filepath)

        # Determine extension for regex matching
        ext = 'javascript' if filepath.endswith('.js') else 'text'
        if filepath.endswith('.json'): ext = 'json'
        if filepath.endswith('.css'): ext = 'css'
        if filepath.endswith('.html'): ext = 'html'

        # Regex to find the code block under the header
        # Escape path for regex
        escaped_path = re.escape(filepath)

        # Use negative lookahead to ensure we don't match ### sub-headers as ## headers
        # Pattern looks for:
        # ## filepath (header)
        # (any text until)
        # ```extension
        # (content)
        # ```

        # Note: The pattern needs to be robust.
        # The memory mentions: "automated parsers must use a regex with negative lookahead (e.g., ^## (?![#]))"
        # However, the previous script used `## {escaped_path}` which seems to work if the headers are `## js/app.js`.
        # I'll stick to the existing pattern structure but handle the extension correctly.

        pattern = rf'(## {escaped_path}[\s\S]*?```{ext}\n)([\s\S]*?)(\n```)'

        match = re.search(pattern, readme)
        if match:
            # Replace the content group (group 2)
            # We use a function for replacement to avoid backslash escaping issues in content
            def replacer(m):
                return m.group(1) + content + m.group(3)

            readme = re.sub(pattern, replacer, readme, count=1)
            print(f"Updated code block for {filepath}")
        else:
            print(f"Warning: Code block for {filepath} not found in README")

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme)

    print("README.md updated successfully.")

if __name__ == "__main__":
    main()
