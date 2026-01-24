import re
import os

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def main():
    readme_path = 'README.md'
    readme = read_file(readme_path)

    # 1. Update Version Header
    # **Version:** 3.9.8 (Palette Update)
    version_pattern = r'(\*\*Version:\*\* )(\d+\.\d+\.\d+)'
    new_version = '3.9.10'

    if re.search(version_pattern, readme):
        print(f"Updating version header to {new_version}")
        readme = re.sub(version_pattern, f'\\g<1>{new_version}', readme)
    else:
        print("Warning: Version header not found")

    # 2. Update File Code Blocks
    # Format:
    # ## filename
    # ...
    # ```ext
    # content
    # ```

    files_to_sync = [
        'js/constants.js',
        'sw.js',
        'js/security.js',
        'js/app.js'
    ]

    for filepath in files_to_sync:
        if not os.path.exists(filepath):
            print(f"Warning: File {filepath} does not exist, skipping.")
            continue

        print(f"Syncing {filepath}...")
        content = read_file(filepath)

        # Determine extension for regex
        ext = 'javascript' if filepath.endswith('.js') else 'text'
        if filepath.endswith('.json'): ext = 'json'
        if filepath.endswith('.css'): ext = 'css'
        if filepath.endswith('.html'): ext = 'html'

        # Regex to find the code block under the header
        # Escape path for regex
        escaped_path = re.escape(filepath)

        # Pattern looks for:
        # ## filepath (header)
        # (any text until)
        # ```extension
        # (content)
        # ```
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

    with open(readme_path, 'w') as f:
        f.write(readme)

    print("README.md updated successfully.")

if __name__ == "__main__":
    main()
