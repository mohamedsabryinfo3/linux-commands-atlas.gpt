# المراجع التقنية الرسمية

الأمثلة في الموقع تعليمية وتستهدف Debian وRocky Linux الحديثين. راجع صفحة `man` المحلية ووثائق الإصدار المثبت قبل الأوامر التغييرية.

- Debian Reference — system initialization, systemd, journalctl and administration: https://www.debian.org/doc/manuals/debian-reference/ch03.en.html
- Debian Reference PDF: https://www.debian.org/doc/manuals/debian-reference/debian-reference.en.pdf
- Debian Reference Card: https://www.debian.org/doc/manuals/refcard/refcard
- Rocky Linux 10 Documentation: https://docs.rockylinux.org/10/
- Rocky Linux Network Configuration: https://docs.rockylinux.org/guides/network/basic_network_configuration/
- Rocky Linux DNF Package Manager: https://docs.rockylinux.org/guides/package_management/dnf_package_manager/
- Rocky Linux SELinux Security: https://docs.rockylinux.org/10/guides/security/learning_selinux/
- Rocky Linux firewalld for Beginners: https://docs.rockylinux.org/guides/security/firewalld-beginners/
- Red Hat Enterprise Linux 10 DNF Command List: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/managing_software_with_the_dnf_tool/dnf-commands-list
- GNU Bash Reference Manual: https://www.gnu.org/software/bash/manual/bash.html
- Linux man-pages project: https://man7.org/linux/man-pages/
- Filesystem Hierarchy Standard: https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html

## ملاحظات توافق مهمة

- Rocky Linux 10 يعتمد NetworkManager وkeyfiles، وأُزيلت منه آلية Network-Scripts القديمة.
- عائلة Debian تستخدم APT/DPKG وحزم DEB؛ عائلة Rocky/RHEL تستخدم DNF/RPM وحزم RPM.
- SELinux جزء مركزي من نموذج Rocky/RHEL؛ Debian غالبًا ما يستخدم AppArmor عند تفعيل MAC.
- `systemd-journald` موجود في الأنظمة الحديثة؛ أما rsyslog ومسارات ملفات السجلات التقليدية فتتوقف على الحزم والإعدادات.
- ليست كل الأدوات المتقدمة مثبتة افتراضيًا؛ قد تحتاج حزمة إضافية، وهذا موضح في بطاقات المرجع.


## مراجع موسوعة التوزيعات الاختيارية

- Ubuntu package management: https://ubuntu.com/server/docs/how-to/software/package-management/
- Rocky Linux 10 documentation: https://docs.rockylinux.org/10/
- Fedora package management: https://fedoraproject.org/wiki/Package_management_system
- CentOS Stream: https://www.centos.org/centos-stream/
- AlmaLinux compatibility FAQ: https://wiki.almalinux.org/FAQ
- SUSE administration and Zypper: https://documentation.suse.com/sles/15-SP6/single-html/SLES-administration/book-administration.html
- ArchWiki Pacman: https://wiki.archlinux.org/title/Pacman
- Alpine Linux about: https://www.alpinelinux.org/about/
- Amazon Linux 2023 package management: https://docs.aws.amazon.com/linux/al2023/ug/package-management.html
- Gentoo Handbook: https://wiki.gentoo.org/wiki/Handbook:AMD64
- NixOS manual: https://nixos.org/manual/nixos/stable/
- Void Linux XBPS: https://docs.voidlinux.org/xbps/
