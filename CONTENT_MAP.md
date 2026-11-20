# Content Map — SOC // Linux Deck

## Visual and interaction model

The interface adopts the user's reference's tactical command-deck pattern:
- Compact terminal identity header and horizontal navigation.
- Hero console + learning route rail.
- `TRK-01` memorization track and `TRK-02` lookup/reference track.
- Searchable cards and category filters.
- Detailed lesson overlays with a custom visual model, distro note, command examples, a VM task and mastery criteria.

## Command tracks

### TRK-01 — Core Memorization
48 commands / command patterns. Learner should:
- Recognize the command from its purpose.
- Recall the common syntax and practical options.
- Type it without copying.
- Interpret output and exit behavior.

### TRK-02 — Advanced Field Reference
174 tools / commands across 11 domains. This is not a memorization list. Learn purpose and context, then consult `man` and official docs before execution.

| Domain | Count |
|---|---:|
| System identity and diagnostics | 12 |
| Advanced text processing and search | 21 |
| Accounts and access control | 19 |
| Processes and advanced systemd | 13 |
| Networking and connectivity | 27 |
| Advanced package queries and management | 12 |
| Advanced storage and disks | 25 |
| Logs and auditing | 7 |
| System security controls | 11 |
| Scheduling and server services | 10 |
| Advanced Bash and script analysis | 17 |
| **Total** | **174** |

## Learning encyclopedia (20 domains)

1. Linux Architecture & Distribution
2. Build the Linux Lab
3. Terminal, Shell & Command Anatomy
4. Linux Filesystem Hierarchy
5. Files & Directory Operations
6. Search & Text Processing
7. Users, Groups & Authentication
8. Permissions & Access Control
9. Process Management
10. Boot Process & systemd
11. System Monitoring & Troubleshooting
12. Linux Networking
13. SSH & Remote Administration
14. Firewall & Host Network Security
15. Package Management & Repositories
16. Storage, Filesystems & LVM
17. Linux Logging & Auditing
18. Bash Scripting & Automation
19. Scheduling & Server Services
20. Linux Security Controls & Hardening

Each domain includes:
- Learning purpose and concepts.
- Topic chips that open a focused explanation.
- A custom visual model/diagram.
- Debian × Rocky note where relevant.
- Commands and a VM micro-lab.
- Mastery criteria and optional personal notes.
- A **closed by default** SOC connection accordion.

## Practical labs (8)

1. Identify the system before working.
2. Safe file and directory operations.
3. Users, groups and permissions.
4. Process tree and process control.
5. Linux network diagnostics.
6. Analyze sample authentication logs.
7. Debian APT vs Rocky DNF.
8. Bash script checks a service.

## Optional reading library

`Linux Distribution Explorer` is a free-reading library, not part of the course progress. It has 10 profiles: Debian lineage, RHEL-compatible enterprise, Fedora/CentOS Stream, SUSE, Arch ecosystem, Alpine, Amazon Linux 2023, Gentoo, NixOS and Void Linux.

## SOC Connection (deferred)

A separate vault, excluded from Linux progress. It opens after the learner confirms Linux and CompTIA Security+ completion. It covers SOC fundamentals, log analysis, SIEM, MITRE ATT&CK, EDR, investigation, incident response, threat hunting, detection engineering and L1/L2 practice.
