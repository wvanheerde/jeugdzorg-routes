/** Site-instellingen op één plek. Vul deze in bij publicatie. */
export const site = {
  /** GitHub-repository, gebruikt voor de link "wijziging voorstellen". */
  repoUrl: 'https://github.com/wvanheerde/jeugdzorg-routes',
  /** GoatCounter-code (het deel vóór .goatcounter.com). Leeg laten = geen statistieken. Of zet PUBLIC_GOATCOUNTER_CODE als omgevingsvariabele. */
  goatcounter: import.meta.env.PUBLIC_GOATCOUNTER_CODE ?? '',
};
