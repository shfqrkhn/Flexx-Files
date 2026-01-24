import re
import os

def update_readme():
    readme_path = 'README.md'
    if not os.path.exists(readme_path):
        print("README.md not found")
        return

    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Version
    # Look for **Version:** X.Y.Z
    content = re.sub(r'(\*\*Version:\*\* )[\d.]+', r'\g<1>3.9.9', content)

    lines = content.split('\n')
    new_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Regex for ## filename
        # Negative lookahead for # to avoid ###
        match = re.match(r'^## (?![#])(.+)', line)

        if match:
            filename = match.group(1).strip()

            if os.path.exists(filename) and os.path.isfile(filename):
                print(f"Syncing {filename}...")
                new_lines.append(line)
                i += 1

                # Scan until code block start
                code_block_start_found = False
                while i < len(lines):
                    l = lines[i]
                    new_lines.append(l)
                    i += 1
                    if l.strip().startswith('```'):
                        code_block_start_found = True
                        break

                if code_block_start_found:
                    # Read source file
                    with open(filename, 'r', encoding='utf-8') as src:
                        src_content = src.read().strip()

                    new_lines.append(src_content)

                    # Skip old content until code block end
                    code_block_end_found = False
                    while i < len(lines):
                        l = lines[i]
                        if l.strip() == '```':
                            new_lines.append(l)
                            i += 1
                            code_block_end_found = True
                            break
                        i += 1

                    if not code_block_end_found:
                        print(f"Error: Could not find closing code block for {filename}")
                else:
                    print(f"Warning: No code block found after header for {filename}")
            else:
                # Not a file we want to sync, just preserve
                new_lines.append(line)
                i += 1
        else:
            new_lines.append(line)
            i += 1

    # Join and write
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

    print("README.md updated successfully.")

if __name__ == '__main__':
    update_readme()
