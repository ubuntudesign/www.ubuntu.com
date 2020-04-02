from webapp.security.database import db_session
from webapp.security.models import (
    CVE,
    CVEReference,
    Bug,
    CVERelease,
    Package,
)


def create_data():
    package = Package(
        name="gitlab",
        type="package",
        source="https://launchpad.net/distros/ubuntu/+source/gitlab",
        ubuntu="https://launchpad.net/ubuntu/+source/gitlab",
        debian="https://tracker.debian.org/pkg/gitlab",
    )
    objects = [
        CVE(
            id="CVE-2020-10535",
            status="active",
            public_date="2020-03-12 23:15:00 UTC",
            priority="low",
            description="GitLab 12.8.x before 12.8.6, when sign-up is enabled,"
            + " allows remote attackers "
            + "to bypass email domain",
            notes="msalvatore	Affects GitLab 12.8.0 to 12.8.5",
        ),
        CVE(
            id="CVE-2019-1010262",
            status="active",
            public_date="2020-03-12 23:15:00 UTC",
            priority="medium",
            description="** REJECT ** DO NOT USE THIS CANDIDATE NUMBER."
            + " ConsultIDs: CVE-2019-1010142. Reason: This candidate"
            + " is a reservation duplicate of CVE-2019-1010142.",
        ),
        CVE(
            id="CVE-2020-9064",
            status="not-for-us",
            notes="Ubuntu-security Does not apply to software "
            + "found in Ubuntu. Huawei",
        ),
        package,
        CVERelease(name="Upstream", status="DNE"),
        CVERelease(name="Ubuntu 12.04 ESM (Precise Pangolin)", status="DNE"),
        CVERelease(name="Ubuntu 14.04 ESM (Trusty Tahr)", status="DNE"),
        CVERelease(
            name="Ubuntu 16.04 LTS (Xenial Xerus)", status="needs-triage"
        ),
        CVERelease(
            name="Ubuntu 18.04 LTS (Bionic Beaver)", status="needs-triage"
        ),
        CVERelease(name="Ubuntu 19.10 (Eoan Ermine)", status="needs-triage"),
        CVERelease(
            name="Ubuntu 20.04 (Focal Fossa)", status="not-affected (1.0.49-4)"
        ),
        CVEReference(
            uri="https://cve.mitre.org/cgi-bin/cvename.cgi?"
            + "name=CVE-2020-9365"
        ),
        CVEReference(
            uri="https://github.com/jedisct1/pure-ftpd/commit/"
            + "36c6d268cb190282a2c17106acfd31863121b"
        ),
        CVEReference(
            uri="https://github.com/jedisct1/pure-ftpd/commit/"
            + "36c6d268cb190282a2c17106acfd31863121b58e"
        ),
        Bug(uri="http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=952471"),
    ]

    db_session.bulk_save_objects(objects)

    # Link packages
    cve = db_session.query(CVE).first()
    release = db_session.query(CVERelease).first()
    package_query = db_session.query(Package).first()
    reference_query = db_session.query(CVEReference).all()
    bugs_query = db_session.query(Bug).all()

    package_query.releases_status.append(release)
    cve.packages.append(package_query)
    for ref in reference_query:
        cve.references.append(ref)

    for bug in bugs_query:
        cve.bugs.append(bug)

    db_session.add(cve)
    db_session.commit()
    db_session.flush()
    return
