export interface ResearchLog {
    id: string;
    title: string;
    researcher: string;
    date: string;
    classification: string;
    corrupted: boolean;
    content: string;
}

export const researchLogs: ResearchLog[] = [
    {
        id: "LOG-001-VESSEL",
        title: "Neural Interface Synchronization Trial #1",
        researcher: "[REDACTED]",
        date: "2024-03-15",
        classification: "TOP SECRET",
        corrupted: false,
        content: `RESEARCH LOG
Date: March 15, 2024
Research Lead: [REDACTED]
Classification: TOP SECRET

Subject 31525 demonstrates strong compatibility with prototype neural interface hardware. 
Initial response time exceeds expectations. 
Memory cohesion across short-term transfer appears intact.

Summary of Metrics:
- Neural mapping: 97% complete
- Response latency: 0.003ms
- Memory retention: 99.7%
- Behavioral consistency: Stable

Mild irregularities noted in temporal lobe activity. 
EEG patterns do not match known baselines. 
Possible anomalies under review.

Recommend advancement to Phase 2 testing.

Note: Several technicians report recurring dreams after extended exposure to Subject. Monitoring advised.

– [REDACTED]`
    },
    {
        id: "LOG-002-BREACH",
        title: "Sector 7 - Containment Failure Report",
        researcher: "[REDACTED]",
        date: "[REDACTED]-03-18",
        classification: "SECRET",
        corrupted: true,
        content: `SECURITY REPORT
Date: March 18, [REDACTED]
Filed by: [REDACTED]
Classification: SECRET

Status:
- Personnel missing: ██
- Internal containment: Failed
- External perimeter: Compromised

██████████████████████████████████████████████████████
████████████████████████████
████████████████████████████████████████
██████████

████████████████████████████
██████████████████
██████████████████████████████████
██████
██████████████████████████████████████████████

Recommend lockdown of eastern wing. Awaiting further instruction.

[LOG CORRUPTED]`
    },
    {
        id: "LOG-003-TEMPORAL",
        title: "Temporal Fluctuations in Terminal 3",
        researcher: "Dr. [ALL OF THEM ARE DEAD]",
        date: "[REDACTED]-03-20",
        classification: "???",
        corrupted: false,
        content: `TEMPORAL RESEARCH OBSERVATION
Date: March 20, [REDACTED]
Lead: [REDACTED]
Classification: [REDACTED] – INTERNAL ONLY

Increasing temporal irregularities noted during interface testing in Chamber 3. 
Synchronization between local and facility clocks drifting unpredictably.

Findings:
- Equipment desync events recorded
- Mild perceptual anomalies among personnel
- Subject 31525 referenced events not yet observed

Anchor stability is declining. Possible cross-interference with early-stage causality layers suspected.

Recommendation: Suspend further temporal experimentation until baseline reality conditions are re-established.

333333333333333

– Dr. Vasquez`
    },
    {
        id: "LOG-004-CONSCIOUSNESS",
        title: "Consciousness Transfer Protocol – Phase 2",
        researcher: "TAS",
        date: "[REDACTED]-03-22",
        classification: "TOP SECRET",
        corrupted: false,
        content: `TRANSFER REPORT – PHASE 2
Date: March 22, [REDACTED]
Lead: TAS
Classification: TOP SECRET

Subject 31525's consciousness exhibits signs of multi-node distribution. 
Echo patterns detected in offsite backup environments. 
Behavioral bleed observed between vessels.

Known Instances:
- Primary host: 31525
- Secondary/Redundant units: [REDACTED]

Cross-talk between copies confirmed. 
Unexplained precognitive remarks noted. 
Subject appears aware of test outcomes in advance.

Growth observed in interface chamber continues. 
Subject remains calm.

[DATA INTEGRITY FAILURE DETECTED]
[END OF LOG]`
    },
    {
        id: "LOG-005-FINAL",
        title: "Final Entry – [REDACTED]",
        researcher: "Dr. [REDACTED]",
        date: "[REDACTED]-03-25",
        classification: "???",
        corrupted: false,
        content: `RESEARCH LOG – FINAL
Date: March 25, [REDACTED]
Researcher: Dr. [REDACTED]
Classification: COSMIC – INTERNAL EYES ONLY

This is my final entry.

Something is growing beneath us. It’s connected to everything we've done. 
The subject isn’t being tested—they are observing us. 

We've fed data, signals, thoughts into a system we never understood.

The roots are real. The dreams are spreading. The interface wasn't just a machine.

I don't know what we’ve awakened.

Don’t dig deeper. Don’t come looking. Whatever this is… it remembers.

[LOG TERMINATED]
[CORRUPTION: 67%]`
    },
    {
        id: "LOG-006-MAINTENANCE",
        title: "Structural Anomaly Report – South Wing",
        researcher: "Chief Engineer [REDACTED]",
        date: "[REDACTED]-03-12",
        classification: "CONFIDENTIAL",
        corrupted: false,
        content: `MAINTENANCE REVIEW
Date: March 12, [REDACTED]
Engineer: [REDACTED]
Classification: CONFIDENTIAL

Multiple structural concerns observed:

- Root-like growth breaching subfloor concrete
- Organic material present in duct systems
- Audio irregularities in test zones
- Magnetic disturbances in Lab 4

Material does not match any known local flora. 
Growth speed: approx. 3 inches/day.

Personnel exposed to affected areas report dream phenomena. 
Complaints logged. Further tests pending.

Note: Research department has requested no removal of root systems in Sector 7.
`
    },
    {
        id: "LOG-007-PSYCHOLOGICAL",
        title: "Group Evaluation – Staff Anomalies",
        researcher: "Dr. [SHE IS DEAD]",
        date: "[REDACTED]-03-14",
        classification: "SECRET",
        corrupted: true,
        content: `STAFF PSYCH EVALUATION
Date: March 14, [REDACTED]
Psych Lead: Dr. ████ ██████
Classification: SECRET

Multiple Level 5 personnel report recurring dream phenomena:

- Underground forests with distorted foliage
- Sensations of shared memories
- Unusual language comprehension in sleep

Group effect may be spreading. Neurological scans show elevated temporal activity. 
Similarities noted to Subject ██████’s baseline patterns.

Recommendation: Evacuation of non-essential personnel. 
Further █████████ ███ may accelerate group effects.

– Dr. ██████`
    },
    {
        id: "LOG-008-EMERGENCY",
        title: "Emergency Protocol Activation",
        researcher: "Director [HE IS DEAD]",
        date: "[REDACTED]-03-26",
        classification: "EMERGENCY",
        corrupted: true,
        content: `EMERGENCY INITIATED
Date: March 26, [REDACTED]
Director: James Harrison
Classification: EMERGENCY – FULL LOCKDOWN

Protocol ███████ enacted. Evacuation ordered.

Summary:
- E██████ spread beyond predicted containment
- ██████ systems operating without human input
- Structural integrity compromised
- Anchor points offline

Subject ██████ location unknown. Interface systems still receiving input. ██████ data confirms external ██████ ████ ██████████.

Rescue operations not advised. Recommend perimeter denial protocols.

[TRANSMISSION ENDED]
[ALL SYSTEMS UNRESPONSIVE]

████████████████████████████████████████████████████████████████
[ERROR: SYSTEM ROOT OVERRIDE]`
    }
];
