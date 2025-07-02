import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { FaChartBar, FaTimes } from 'react-icons/fa';

const getCountryName = (code) => {
  const countryNames = {
    AF: 'Afganistán',
    AL: 'Albania',
    DE: 'Alemania',
    AD: 'Andorra',
    AO: 'Angola',
    AI: 'Anguila',
    AQ: 'Antártida',
    AG: 'Antigua y Barbuda',
    SA: 'Arabia Saudita',
    DZ: 'Argelia',
    AR: 'Argentina',
    AM: 'Armenia',
    AW: 'Aruba',
    AU: 'Australia',
    AT: 'Austria',
    AZ: 'Azerbaiyán',
    BS: 'Bahamas',
    BH: 'Baréin',
    BD: 'Bangladés',
    BB: 'Barbados',
    BE: 'Bélgica',
    BZ: 'Belice',
    BJ: 'Benín',
    BY: 'Bielorrusia',
    MM: 'Birmania',
    BO: 'Bolivia',
    BA: 'Bosnia y Herzegovina',
    BW: 'Botsuana',
    BR: 'Brasil',
    BN: 'Brunéi',
    BG: 'Bulgaria',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    BT: 'Bután',
    CV: 'Cabo Verde',
    KH: 'Camboya',
    CM: 'Camerún',
    CA: 'Canadá',
    QA: 'Catar',
    TD: 'Chad',
    CL: 'Chile',
    CN: 'China',
    CY: 'Chipre',
    CO: 'Colombia',
    KM: 'Comoras',
    KP: 'Corea del Norte',
    KR: 'Corea del Sur',
    CI: 'Costa de Marfil',
    CR: 'Costa Rica',
    HR: 'Croacia',
    CU: 'Cuba',
    DK: 'Dinamarca',
    DM: 'Dominica',
    EC: 'Ecuador',
    EG: 'Egipto',
    SV: 'El Salvador',
    AE: 'Emiratos Árabes Unidos',
    ER: 'Eritrea',
    SK: 'Eslovaquia',
    SI: 'Eslovenia',
    ES: 'España',
    US: 'Estados Unidos',
    EE: 'Estonia',
    SZ: 'Esuatini',
    ET: 'Etiopía',
    PH: 'Filipinas',
    FI: 'Finlandia',
    FJ: 'Fiyi',
    FR: 'Francia',
    GA: 'Gabón',
    GM: 'Gambia',
    GE: 'Georgia',
    GH: 'Ghana',
    GI: 'Gibraltar',
    GD: 'Granada',
    GR: 'Grecia',
    GL: 'Groenlandia',
    GT: 'Guatemala',
    GY: 'Guyana',
    HT: 'Haití',
    HN: 'Honduras',
    HK: 'Hong Kong',
    HU: 'Hungría',
    IN: 'India',
    ID: 'Indonesia',
    IQ: 'Irak',
    IR: 'Irán',
    IE: 'Irlanda',
    IS: 'Islandia',
    IL: 'Israel',
    IT: 'Italia',
    JM: 'Jamaica',
    JP: 'Japón',
    JO: 'Jordania',
    KZ: 'Kazajistán',
    KE: 'Kenia',
    KG: 'Kirguistán',
    KI: 'Kiribati',
    KW: 'Kuwait',
    LA: 'Laos',
    LS: 'Lesoto',
    LV: 'Letonia',
    LB: 'Líbano',
    LR: 'Liberia',
    LY: 'Libia',
    LI: 'Liechtenstein',
    LT: 'Lituania',
    LU: 'Luxemburgo',
    MO: 'Macao',
    MG: 'Madagascar',
    MY: 'Malasia',
    MW: 'Malaui',
    MV: 'Maldivas',
    ML: 'Malí',
    MT: 'Malta',
    MA: 'Marruecos',
    MU: 'Mauricio',
    MR: 'Mauritania',
    MX: 'México',
    MD: 'Moldavia',
    MC: 'Mónaco',
    MN: 'Mongolia',
    ME: 'Montenegro',
    MZ: 'Mozambique',
    NA: 'Namibia',
    NR: 'Nauru',
    NP: 'Nepal',
    NI: 'Nicaragua',
    NE: 'Níger',
    NG: 'Nigeria',
    NO: 'Noruega',
    NZ: 'Nueva Zelanda',
    OM: 'Omán',
    NL: 'Países Bajos',
    PK: 'Pakistán',
    PA: 'Panamá',
    PG: 'Papúa Nueva Guinea',
    PY: 'Paraguay',
    PE: 'Perú',
    PL: 'Polonia',
    PT: 'Portugal',
    GB: 'Reino Unido',
    CF: 'República Centroafricana',
    CZ: 'República Checa',
    CD: 'República Democrática del Congo',
    DO: 'República Dominicana',
    RW: 'Ruanda',
    RO: 'Rumania',
    RU: 'Rusia',
    WS: 'Samoa',
    KN: 'San Cristóbal y Nieves',
    SM: 'San Marino',
    VC: 'San Vicente y las Granadinas',
    LC: 'Santa Lucía',
    ST: 'Santo Tomé y Príncipe',
    SN: 'Senegal',
    RS: 'Serbia',
    SC: 'Seychelles',
    SL: 'Sierra Leona',
    SG: 'Singapur',
    SY: 'Siria',
    SO: 'Somalia',
    ZA: 'Sudáfrica',
    SD: 'Sudán',
    SS: 'Sudán del Sur',
    SE: 'Suecia',
    CH: 'Suiza',
    SR: 'Surinam',
    TH: 'Tailandia',
    TW: 'Taiwán',
    TZ: 'Tanzania',
    TJ: 'Tayikistán',
    TL: 'Timor Oriental',
    TG: 'Togo',
    TO: 'Tonga',
    TT: 'Trinidad y Tobago',
    TN: 'Túnez',
    TM: 'Turkmenistán',
    TR: 'Turquía',
    TV: 'Tuvalu',
    UA: 'Ucrania',
    UG: 'Uganda',
    UY: 'Uruguay',
    UZ: 'Uzbekistán',
    VU: 'Vanuatu',
    VE: 'Venezuela',
    VN: 'Vietnam',
    YE: 'Yemen',
    DJ: 'Yibuti',
    ZM: 'Zambia',
    ZW: 'Zimbabue'
  };
  return countryNames[code] || code;
};

const VisitCounter = () => {
  const [stats, setStats] = useState({
    total: 0,
    countries: []
  });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch('/.netlify/functions/track-visit', { method: 'POST' });
        const response = await fetch('/.netlify/functions/get-visits');
        const data = await response.json();

        setStats({
          total: data.totalVisits,
          countries: data.countries.map(item => ({
            code: item.country,
            name: getCountryName(item.country),
            count: item.visit_count
          }))
        });
      } catch (error) {
        console.error("Error fetching visits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`
      fixed top-80 right-5 z-50 shadow-md transition-all duration-300 ease-in-out
      ${expanded ?
        'rounded-xl bg-white/90 w-72' :
        'rounded-full bg-white/80 w-12 h-12'}
    `}>
      {/* Botón principal */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 flex items-center justify-center relative focus:outline-none"
        aria-label={expanded ? "Ocultar estadísticas" : "Mostrar estadísticas"}
      >
        {expanded ? (
          <FaTimes className="text-black text-xl" />
        ) : (
          <>
            <FaChartBar className="text-black text-xl" />
            {!loading && (
              <span className="
                absolute -bottom-1 -right-1 bg-green-500 rounded-full
                w-5 h-5 flex items-center justify-center text-xs text-black
              ">
                {stats.total}
              </span>
            )}
          </>
        )}
      </button>

      {/* Contenido expandido */}
      {expanded && (
        <div className="p-4">
          <h3 className="
            flex items-center gap-2 mb-3 pb-2 border-b border-gray-600
            text-black text-sm font-medium
          ">
            <FaChartBar />
            <span>Visitas totales: <strong>{stats.total.toLocaleString()}</strong></span>
          </h3>

          <div className="max-h-48 overflow-y-auto pr-2">
            {stats.countries.map((country, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between py-2
                  ${index !== stats.countries.length - 1 ?
                    'border-b border-dashed border-gray-600' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    className="w-5 h-4 shadow-[0_0_1px_rgba(0,0,0,0.5)]"
                    title={country.name}
                  />
                  <span className="text-black text-sm">{country.name}</span>
                </div>
                <strong className="text-black">{country.count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitCounter;