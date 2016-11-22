import { TeXParser } from '../TeXParser';

// tslint:disable
const raw =
`
@article{nigam_preliminary_2003,
    title = {A preliminary investigation into bacterial contamination of {Welsh} emergency ambulances},
    volume = {20},
    issn = {1472-0205},
    url = {http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1726203/},
    doi = {10.1136/emj.20.5.479},
    abstract = {Methods: Specific sites within emergency vehicles were swabbed, before and after vehicle cleaning, over a 12 month period, on a monthly basis. All swabs were sent to pathology laboratories for culturing and analysis. , Results: Results showed that most sites within emergency vehicles across Wales were contaminated with a range of bacterial species before vehicle cleaning. After vehicle cleaning, many sites in vehicles were still contaminated, and some sites that were previously uncontaminated, became freshly contaminated as a result of cleaning methods used. , Conclusions: The authors conclude that the Welsh emergency vehicles examined exhibited an unacceptable level of bacterial contamination. This finding should be carefully considered and all attempts must be made to tackle the problem of vehicle cleanliness and infection control.},
    number = {5},
    urldate = {2015-06-30TZ},
    journal = {Emergency Medicine Journal : EMJ},
    author = {Nigam, Y and Cutter, J},
    month = sep,
    year = {2003},
    pmid = {12954699},
    pmcid = {PMC1726203},
    pages = {479--482}
}

@article{peltan_international_2015,
    title = {An {International} {Normalized} {Ratio}–{Based} {Definition} of {Acute} {Traumatic} {Coagulopathy} {Is} {Associated} {With} {Mortality}, {Venous} {Thromboembolism}, and {Multiple} {Organ} {Failure} {After} {Injury}:},
    volume = {43},
    issn = {0090-3493},
    shorttitle = {An {International} {Normalized} {Ratio}–{Based} {Definition} of {Acute} {Traumatic} {Coagulopathy} {Is} {Associated} {With} {Mortality}, {Venous} {Thromboembolism}, and {Multiple} {Organ} {Failure} {After} {Injury}},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=00003246-201507000-00011},
    doi = {10.1097/CCM.0000000000000981},
    language = {en},
    number = {7},
    urldate = {2015-06-27TZ},
    journal = {Critical Care Medicine},
    author = {Peltan, Ithan D. and Vande Vusse, Lisa K. and Maier, Ronald V. and Watkins, Timothy R.},
    month = jul,
    year = {2015},
    pages = {1429--1438}
}

@article{inaba_2014_2015,
    title = {2014 {Consensus} conference on viscoelastic test–based transfusion guidelines for early trauma resuscitation: {Report} of the panel},
    volume = {78},
    issn = {2163-0755},
    shorttitle = {2014 {Consensus} conference on viscoelastic test–based transfusion guidelines for early trauma resuscitation},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=01586154-201506000-00023},
    doi = {10.1097/TA.0000000000000657},
    language = {en},
    number = {6},
    urldate = {2015-05-31TZ},
    journal = {Journal of Trauma and Acute Care Surgery},
    author = {Inaba, Kenji and Rizoli, Sandro and Veigas, Precilla V. and Callum, Jeannie and Davenport, Ross and Hess, John and Maegele, Marc},
    month = jun,
    year = {2015},
    pages = {1220--1229}
}

@article{campbell_acute_2015,
    title = {Acute traumatic coagulopathy: {Whole} blood thrombelastography measures the tip of the iceberg},
    volume = {78},
    issn = {2163-0755},
    shorttitle = {Acute traumatic coagulopathy},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=01586154-201505000-00009},
    doi = {10.1097/TA.0000000000000586},
    language = {en},
    number = {5},
    urldate = {2015-05-08TZ},
    journal = {Journal of Trauma and Acute Care Surgery},
    author = {Campbell, James Eric and Aden, James Keith and Cap, Andrew Peter},
    month = may,
    year = {2015},
    pages = {955--961}
}

@article{masicampo_peculiar_2012,
    title = {A peculiar prevalence of p values just below .05},
    volume = {65},
    issn = {1747-0218},
    url = {http://dx.doi.org/10.1080/17470218.2012.711335},
    doi = {10.1080/17470218.2012.711335},
    abstract = {In null hypothesis significance testing (NHST), p values are judged relative to an arbitrary threshold for significance (.05). The present work examined whether that standard influences the distribution of p values reported in the psychology literature. We examined a large subset of papers from three highly regarded journals. Distributions of p were found to be similar across the different journals. Moreover, p values were much more common immediately below .05 than would be expected based on the number of p values occurring in other ranges. This prevalence of p values just below the arbitrary criterion for significance was observed in all three journals. We discuss potential sources of this pattern, including publication bias and researcher degrees of freedom.},
    number = {11},
    urldate = {2015-04-26TZ},
    journal = {The Quarterly Journal of Experimental Psychology},
    author = {Masicampo, E. J. and Lalande, Daniel R.},
    month = nov,
    year = {2012},
    pmid = {22853650},
    pages = {2271--2279}
}

@article{viti_practical_2015,
    title = {A practical overview on probability distributions},
    volume = {7},
    url = {http://www.jthoracdis.com/article/view/4086/4453},
    doi = {10.3978/j.issn.2072-1439.2015.01.37},
    language = {English},
    number = {3},
    journal = {Journal of Thoracic Disease},
    author = {Viti, Andrea and Terzi, Alberto and Bertolaccini, Luca},
    month = mar,
    year = {2015},
    keywords = {Distributions, Probability}
}

@article{lacroix_age_2015,
    title = {Age of {Transfused} {Blood} in {Critically} {Ill} {Adults}},
    issn = {1533-4406},
    doi = {10.1056/NEJMoa1500704},
    abstract = {Background Fresh red cells may improve outcomes in critically ill patients by enhancing oxygen delivery while minimizing the risks of toxic effects from cellular changes and the accumulation of bioactive materials in blood components during prolonged storage. Methods In this multicenter, randomized, blinded trial, we assigned critically ill adults to receive either red cells that had been stored for less than 8 days or standard-issue red cells (the oldest compatible units available in the blood bank). The primary outcome measure was 90-day mortality. Results Between March 2009 and May 2014, at 64 centers in Canada and Europe, 1211 patients were assigned to receive fresh red cells (fresh-blood group) and 1219 patients were assigned to receive standard-issue red cells (standard-blood group). Red cells were stored a mean (±SD) of 6.1±4.9 days in the fresh-blood group as compared with 22.0±8.4 days in the standard-blood group (P{\textless}0.001). At 90 days, 448 patients (37.0\%) in the fresh-blood group and 430 patients (35.3\%) in the standard-blood group had died (absolute risk difference, 1.7 percentage points; 95\% confidence interval [CI], -2.1 to 5.5). In the survival analysis, the hazard ratio for death in the fresh-blood group, as compared with the standard-blood group, was 1.1 (95\% CI, 0.9 to 1.2; P=0.38). There were no significant between-group differences in any of the secondary outcomes (major illnesses; duration of respiratory, hemodynamic, or renal support; length of stay in the hospital; and transfusion reactions) or in the subgroup analyses. Conclusions Transfusion of fresh red cells, as compared with standard-issue red cells, did not decrease the 90-day mortality among critically ill adults. (Funded by the Canadian Institutes of Health Research and others; Current Controlled Trials number, ISRCTN44878718 .).},
    language = {ENG},
    journal = {The New England Journal of Medicine},
    author = {Lacroix, Jacques and Hébert, Paul C. and Fergusson, Dean A. and Tinmouth, Alan and Cook, Deborah J. and Marshall, John C. and Clayton, Lucy and McIntyre, Lauralyn and Callum, Jeannie and Turgeon, Alexis F. and Blajchman, Morris A. and Walsh, Timothy S. and Stanworth, Simon J. and Campbell, Helen and Capellier, Gilles and Tiberghien, Pierre and Bardiaux, Laurent and van de Watering, Leo and van der Meer, Nardo J. and Sabri, Elham and Vo, Dong and {ABLE Investigators and the Canadian Critical Care Trials Group}},
    month = mar,
    year = {2015},
    pmid = {25776801},
    keywords = {Landmark, PRBCs, Storage}
}

@article{chan_synthetic_2015,
    title = {A synthetic fibrin cross-linking polymer for modulating clot properties and inducing hemostasis},
    volume = {7},
    issn = {1946-6242},
    doi = {10.1126/scitranslmed.3010383},
    abstract = {Clotting factor replacement is the standard management of acute bleeding in congenital and acquired bleeding disorders. We present a synthetic approach to hemostasis using an engineered hemostatic polymer (PolySTAT) that circulates innocuously in the blood, identifies sites of vascular injury, and promotes clot formation to stop bleeding. PolySTAT induces hemostasis by cross-linking the fibrin matrix within clots, mimicking the function of the transglutaminase factor XIII. Furthermore, synthetic PolySTAT binds specifically to fibrin monomers and is uniformly integrated into fibrin fibers during fibrin polymerization, resulting in a fortified, hybrid polymer network with enhanced resistance to enzymatic degradation. In vivo hemostatic activity was confirmed in a rat model of trauma and fluid resuscitation in which intravenous administration of PolySTAT improved survival by reducing blood loss and resuscitation fluid requirements. PolySTAT-induced fibrin cross-linking is a novel approach to hemostasis using synthetic polymers for noninvasive modulation of clot architecture with potentially wide-ranging therapeutic applications.},
    language = {ENG},
    number = {277},
    journal = {Science Translational Medicine},
    author = {Chan, Leslie W. and Wang, Xu and Wei, Hua and Pozzo, Lilo D. and White, Nathan J. and Pun, Suzie H.},
    month = mar,
    year = {2015},
    pmid = {25739763},
    keywords = {Hemostasis, PolySTAT},
    pages = {277ra29}
}

@article{roberts_applying_2014,
    title = {Applying results from clinical trials: tranexamic acid in trauma patients},
    volume = {2},
    issn = {2052-0492},
    shorttitle = {Applying results from clinical trials},
    doi = {10.1186/s40560-014-0056-1},
    abstract = {This paper considers how results from clinical trials should be applied in the care of patients, using the results of the Clinical Randomisation of an Antifibrinolytic in Significant Haemorrhage (CRASH-2) trial of tranexamic acid in bleeding trauma patients as a case study. We explain why an understanding of the mechanisms of action of the trial treatment, and insight into the factors that might be relevant to this mechanism, is critical in order to properly apply (generalise) trial results and why it is not necessary that the trial population is representative of the population in which the medicine will be used. We explain why cause (mechanism)-specific mortality is more generalizable than all-cause mortality and why the risk ratio is the generalizable measure of the effect of the treatment. Overall, we argue that a biological insight into how the treatment works is more relevant when applying research results to patient care than the application of statistical reasoning.},
    language = {eng},
    number = {1},
    journal = {Journal of Intensive Care},
    author = {Roberts, Ian and Prieto-Merino, David},
    year = {2014},
    pmid = {25705414},
    pmcid = {PMC4336134},
    keywords = {TXA},
    pages = {56}
}

@article{aubron_age_2013,
    title = {Age of red blood cells and transfusion in critically ill patients},
    volume = {3},
    issn = {2110-5820},
    doi = {10.1186/2110-5820-3-2},
    abstract = {Red blood cells (RBC) storage facilitates the supply of RBC to meet the clinical demand for transfusion and to avoid wastage. However, RBC storage is associated with adverse changes in erythrocytes and their preservation medium. These changes are responsible for functional alterations and for the accumulation of potentially injurious bioreactive substances. They also may have clinically harmful effects especially in critically ill patients. The clinical consequences of storage lesions, however, remain a matter of persistent controversy. Multiple retrospective, observational, and single-center studies have reported heterogeneous and conflicting findings about the effect of blood storage duration on morbidity and/or mortality in trauma, cardiac surgery, and intensive care unit patients. Describing the details of this controversy, this review not only summarizes the current literature but also highlights the equipoise that currently exists with regard to the use of short versus current standard (extended) storage duration red cells in critically ill patients and supports the need for large, randomized, controlled trials evaluating the clinical impact of transfusing fresh (short duration of storage) versus older (extended duration of storage) red cells in critically ill patients.},
    language = {eng},
    number = {1},
    journal = {Annals of Intensive Care},
    author = {Aubron, Cécile and Nichol, Alistair and Cooper, D. Jamie and Bellomo, Rinaldo},
    year = {2013},
    pmid = {23316800},
    pmcid = {PMC3575378},
    keywords = {Age, PRBCs, Transfusion},
    pages = {2}
}

@article{miller_critique_2003,
    title = {A critique of clinical equipoise. {Therapeutic} misconception in the ethics of clinical trials},
    volume = {33},
    issn = {0093-0334},
    abstract = {A predominant ethical view holds that physician-investigators should conduct their research with therapeutic intent. And since a physician offering a therapy wouldn't prescribe second-rate treatments, the experimental intervention and the best proven therapy should appear equally effective. "Clinical equipoise" is necessary. But this perspective is flawed. The ethics of research and of therapy are fundamentally different, and clinical equipoise should be abandoned.},
    language = {eng},
    number = {3},
    journal = {The Hastings Center Report},
    author = {Miller, Franklin G. and Brody, Howard},
    month = jun,
    year = {2003},
    pmid = {12854452},
    keywords = {Equipoise},
    pages = {19--28}
}

@article{andrew_acei_2011,
    title = {{ACEI} associated angioedema - a case study and review},
    volume = {40},
    issn = {0300-8495},
    abstract = {BACKGROUND: Angioedema is an infrequent but potentially serious adverse effect of angiotensin converting enzyme inhibitors (ACEIs).
OBJECTIVE: This article describes a case of ACEI associated angioedema and reviews important clinical features of the condition.
DISCUSSION: The mechanism of ACEI associated angioedema is not allergic (histamine mediated), but rather due to an alteration of the balance of bradykinin and other vasodilator mediators. Onset may be delayed for weeks, months or years and episodes may be recurrent. Occasionally, airway obstruction may occur. Diagnosis is from history and physical examination; there is no specific diagnostic test. In contrast to allergic angioedema, ACEI associated angioedema is generally unresponsive to corticosteroids and antihistamines, although these agents are often used by convention. In the longer term, cessation of the ACEI is necessary to reduce the risk of recurrent episodes.},
    language = {eng},
    number = {12},
    journal = {Australian Family Physician},
    author = {Andrew, Nick and Gabb, Genevieve and Del Fante, Matthew},
    month = dec,
    year = {2011},
    pmid = {22146327},
    keywords = {ACE Inhibitors, Angioedema},
    pages = {985--988}
}

@article{brown_accidental_2012,
    title = {Accidental hypothermia},
    volume = {367},
    issn = {1533-4406},
    doi = {10.1056/NEJMra1114208},
    language = {eng},
    number = {20},
    journal = {The New England Journal of Medicine},
    author = {Brown, Douglas J. A. and Brugger, Hermann and Boyd, Jeff and Paal, Peter},
    month = nov,
    year = {2012},
    pmid = {23150960},
    keywords = {Accidental Hypothermia, Hypothermia, Landmark},
    pages = {1930--1938}
}

@article{brohi_acute_2003,
    title = {Acute traumatic coagulopathy},
    volume = {54},
    issn = {0022-5282},
    doi = {10.1097/01.TA.0000069184.82147.06},
    abstract = {BACKGROUND: Traumatic coagulopathy is thought to be caused primarily by fluid administration and hypothermia.
METHODS: A retrospective study was performed to determine whether coagulopathy resulting from the injury itself is a clinically important entity in severely injured patients.
RESULTS: One thousand eight hundred sixty-seven consecutive trauma patients were reviewed, of whom 1,088 had full data sets. Median Injury Severity Score was 20, and 57.7\% had an Injury Severity Score {\textgreater} 15; 24.4\% of patients had a significant coagulopathy. Patients with an acute coagulopathy had significantly higher mortality (46.0\% vs. 10.9\%; chi2, p {\textless} 0.001). The incidence of coagulopathy increased with severity of injury, but was not related to the volume of intravenous fluid administered (r2 = 0.25, p {\textless} 0.001).
CONCLUSION: There is a common and clinically important acute traumatic coagulopathy that is not related to fluid administration. This is a marker of injury severity and is related to mortality. A coagulation screen is an important early test in severely injured patients.},
    language = {eng},
    number = {6},
    journal = {The Journal of Trauma},
    author = {Brohi, Karim and Singh, Jasmin and Heron, Mischa and Coats, Timothy},
    month = jun,
    year = {2003},
    pmid = {12813333},
    keywords = {Acute Traumatic Coagulopathy, Coagulopathy, Landmark, Trauma},
    pages = {1127--1130}
}

@article{borenstein_basic_2010,
    title = {A basic introduction to fixed-effect and random-effects models for meta-analysis},
    volume = {1},
    issn = {17592879},
    url = {http://doi.wiley.com/10.1002/jrsm.12},
    doi = {10.1002/jrsm.12},
    language = {en},
    number = {2},
    urldate = {2015-02-01TZ},
    journal = {Research Synthesis Methods},
    author = {Borenstein, Michael and Hedges, Larry V. and Higgins, Julian P.T. and Rothstein, Hannah R.},
    month = apr,
    year = {2010},
    keywords = {Meta-analysis, Statistics},
    pages = {97--111}
}

@article{bulger_evidence-based_2014,
    title = {An {Evidence}-based {Prehospital} {Guideline} for {External} {Hemorrhage} {Control}: {American} {College} of {Surgeons} {Committee} on {Trauma}},
    volume = {18},
    issn = {1090-3127, 1545-0066},
    shorttitle = {An {Evidence}-based {Prehospital} {Guideline} for {External} {Hemorrhage} {Control}},
    url = {http://informahealthcare.com/doi/abs/10.3109/10903127.2014.896962},
    doi = {10.3109/10903127.2014.896962},
    language = {en},
    number = {2},
    urldate = {2015-02-01TZ},
    journal = {Prehospital Emergency Care},
    author = {Bulger, Eileen M. and Snyder, David and Schoelles, Karen and Gotschall, Cathy and Dawson, Drew and Lang, Eddy and Sanddal, Nels D. and Butler, Frank K. and Fallat, Mary and Taillac, Peter and White, Lynn and Salomone, Jeffrey P. and Seifarth, William and Betzner, Michael J. and Johannigman, Jay and McSwain, Norman},
    month = apr,
    year = {2014},
    keywords = {EMS, Guidelines, Hemorrhage, Prehospital, Tourniquet},
    pages = {163--173}
}

@article{the_process_investigators_randomized_2014,
    title = {A {Randomized} {Trial} of {Protocol}-{Based} {Care} for {Early} {Septic} {Shock}},
    volume = {370},
    issn = {0028-4793, 1533-4406},
    url = {http://www.nejm.org/doi/abs/10.1056/NEJMoa1401602},
    doi = {10.1056/NEJMoa1401602},
    language = {en},
    number = {18},
    urldate = {2015-02-01TZ},
    journal = {New England Journal of Medicine},
    author = {{The ProCESS Investigators}},
    month = may,
    year = {2014},
    keywords = {Dogmalysis, Landmark, ProCESS, Sepsis},
    pages = {1683--1693}
}

@article{levy_antifibrinolytic_2010,
    title = {Antifibrinolytic therapy: new data and new concepts},
    volume = {376},
    shorttitle = {Antifibrinolytic therapy},
    url = {http://www.thelancet.com/journals/lancet/article/PIIS0140673610609397/abstract},
    number = {9734},
    urldate = {2015-02-01TZ},
    journal = {The Lancet},
    author = {Levy, Jerrold H.},
    year = {2010},
    keywords = {Antifibrinolytic},
    pages = {3--4}
}

@article{jones_introduction_2003,
    title = {An introduction to power and sample size estimation},
    volume = {20},
    url = {http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1726174/},
    number = {5},
    urldate = {2015-02-01TZ},
    journal = {Emergency medicine journal: EMJ},
    author = {Jones, S. and Carley, S. and Harrison, M.},
    year = {2003},
    keywords = {Power, Sample Size, Statistics},
    pages = {453}
}

@article{egerton-warburton_antiemetic_2014,
    title = {Antiemetic {Use} for {Nausea} and {Vomiting} in {Adult} {Emergency} {Department} {Patients}: {Randomized} {Controlled} {Trial} {Comparing} {Ondansetron}, {Metoclopramide}, and {Placebo}},
    volume = {64},
    issn = {01960644},
    shorttitle = {Antiemetic {Use} for {Nausea} and {Vomiting} in {Adult} {Emergency} {Department} {Patients}},
    url = {http://linkinghub.elsevier.com/retrieve/pii/S0196064414002236},
    doi = {10.1016/j.annemergmed.2014.03.017},
    language = {en},
    number = {5},
    urldate = {2015-02-01TZ},
    journal = {Annals of Emergency Medicine},
    author = {Egerton-Warburton, Diana and Meek, Robert and Mee, Michaela J. and Braitberg, George},
    month = nov,
    year = {2014},
    keywords = {Antiemetic, Nausea, Placebo, Vomiting, Zofran},
    pages = {526--532.e1}
}

@article{hebert_multicenter_1999,
    title = {A multicenter, randomized, controlled clinical trial of transfusion requirements in critical care},
    volume = {340},
    url = {http://www.nejm.org/doi/full/10.1056/NEJM199902113400601},
    number = {6},
    urldate = {2015-02-01TZ},
    journal = {New England Journal of Medicine},
    author = {Hébert, Paul C. and Wells, George and Blajchman, Morris A. and Marshall, John and Martin, Claudio and Pagliarello, Giuseppe and Tweeddale, Martin and Schweitzer, Irwin and Yetisir, Elizabeth},
    year = {1999},
    keywords = {Landmark, Transfusion},
    pages = {409--417}
}

@article{mclaughlin_predictive_2008,
    title = {A {Predictive} {Model} for {Massive} {Transfusion} in {Combat} {Casualty} {Patients}:},
    volume = {64},
    issn = {0022-5282},
    shorttitle = {A {Predictive} {Model} for {Massive} {Transfusion} in {Combat} {Casualty} {Patients}},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=00005373-200802001-00010},
    doi = {10.1097/TA.0b013e318160a566},
    language = {en},
    number = {Supplement},
    urldate = {2015-02-01TZ},
    journal = {The Journal of Trauma: Injury, Infection, and Critical Care},
    author = {McLaughlin, Daniel F. and Niles, Sarah E. and Salinas, Jose and Perkins, Jeremy G. and Cox, E Darrin and Wade, Charles E. and Holcomb, John B.},
    month = feb,
    year = {2008},
    keywords = {Combat, Massive Transfusion, Military, Prediction, Trauma},
    pages = {S57--S63}
}

@article{maegele_update_2014,
    title = {An {Update} on the {Coagulopathy} of {Trauma}:},
    volume = {41},
    issn = {1073-2322},
    shorttitle = {An {Update} on the {Coagulopathy} of {Trauma}},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=00024382-201405001-00004},
    doi = {10.1097/SHK.0000000000000088},
    language = {en},
    urldate = {2015-02-01TZ},
    journal = {Shock},
    author = {Maegele, Marc and Schöchl, Herbert and Cohen, Mitchell J.},
    month = may,
    year = {2014},
    keywords = {Coagulopathy, Trauma},
    pages = {21--25}
}

@article{davis_analysis_2014,
    title = {An analysis of prehospital deaths: {Who} can we save?},
    volume = {77},
    issn = {2163-0755},
    shorttitle = {An analysis of prehospital deaths},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=01586154-201408000-00005},
    doi = {10.1097/TA.0000000000000292},
    language = {en},
    number = {2},
    urldate = {2015-02-01TZ},
    journal = {Journal of Trauma and Acute Care Surgery},
    author = {Davis, James S. and Satahoo, Shevonne S. and Butler, Frank K. and Dermer, Harrison and Naranjo, Daniel and Julien, Katherina and Van Haren, Robert M. and Namias, Nicholas and Blackbourne, Lorne H. and Schulman, Carl I.},
    month = aug,
    year = {2014},
    keywords = {EMS, Prehospital, Trauma},
    pages = {213--218}
}

@article{brohi_acute_2007,
    title = {Acute {Traumatic} {Coagulopathy}: {Initiated} by {Hypoperfusion}: {Modulated} {Through} the {Protein} {C} {Pathway}?},
    volume = {245},
    issn = {0003-4932},
    shorttitle = {Acute {Traumatic} {Coagulopathy}},
    url = {http://content.wkhealth.com/linkback/openurl?sid=WKPTLP:landingpage&an=00000658-200705000-00021},
    doi = {10.1097/01.sla.0000256862.79374.31},
    language = {en},
    number = {5},
    urldate = {2015-02-01TZ},
    journal = {Annals of Surgery},
    author = {Brohi, Karim and Cohen, Mitchell J. and Ganter, Michael T. and Matthay, Michael A. and Mackersie, Robert C. and Pittet, Jean-Fran??ois},
    month = may,
    year = {2007},
    keywords = {Acute Traumatic Coagulopathy, Coagulopathy, Trauma},
    pages = {812--818}
}
`;
// tslint:enable

describe('TeXParser', () => {
    it('should work', () => {
        const parser = new TeXParser(raw);
        expect(parser.parse()).toBeTruthy();
    });
});
