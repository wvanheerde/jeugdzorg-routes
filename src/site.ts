/** Site-instellingen op één plek. Vul deze in bij publicatie. */
/** Begin van elk intern pad: leeg op een eigen domein, anders bv. "/jeugdzorg-routes" (zonder slash aan het eind). */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const site = {
  /** GitHub-repository, gebruikt voor de link "wijziging voorstellen". */
  repoUrl: 'https://github.com/wvanheerde/jeugdzorg-routes',
  /** GoatCounter-code (het deel vóór .goatcounter.com). Leeg laten = geen statistieken. Of zet PUBLIC_GOATCOUNTER_CODE als omgevingsvariabele. */
  goatcounter: import.meta.env.PUBLIC_GOATCOUNTER_CODE ?? '',
};
