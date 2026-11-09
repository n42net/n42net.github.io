/* Englische Fassung. Deutsch steht in index.html; hier nur, was index.html bei ?lang=en ersetzt.
   text: Schlüssel aus data-t / data-ta im HTML. content, groups: Felder, die über CONTENT und GROUPS gelegt werden. */
(() => {
  const sh = (label, h2, p) => `<div class="label">${label}</div><h2>${h2}</h2>${p}`;
  window.WACHT_EN = {
    text: {
      top: 'To the top', homeTitle: 'To the start page', sections: 'Sections', openCmdk: 'Open command palette', themeBtn: 'Change theme',
      family: 'The Wacht family', familySub: 'Six integrations, one family.', jump: 'Jump to …',
      nav: '<a href="#wachten">Integrations</a><a href="#gleisplan">Data flow</a><a href="#steckbrief">Profile</a><a href="#bauplan">Blueprint</a><a href="#werkstatt">Workshop</a><a href="#lebensweg">Release path</a><a href="#zahlen">Numbers</a>',
      lede: 'Six integrations for Home Assistant. Four around <b>energy</b>: heat pump, electricity tariff, home battery and PV feed-in. Two for <b>on the move and informed</b>: traffic and breaking news. Calculated locally, without third-party libraries, openly documented. Built with an AI agent under fixed rules, approved by a human. Wärmewacht works anywhere; the other five are built around German data sources and rules.',
      ctaDemos: 'View demos', monAria: 'Channel monitor with synthetic signals', monTitle: 'Channel monitor', monFoot: 'Signals synthetic, not measurements',
      s1: sh('01 · The six', 'What each integration answers', '<p>Each demo runs in the browser and calculates with the integration’s real code, but shows invented data only. Installation is via the Home Assistant Marketplace (up to 2026.10: HACS).</p>'),
      s2: sh('02 · Data flow', 'Where the data comes from and what it becomes', '<p>Sources on the left, the integrations in the middle, what appears in Home Assistant on the right. Hover over an integration or select it with Tab: only its paths stay visible. A click opens its profile.</p>'),
      s3: sh('03 · Profile', 'How an integration works inside', '<p>Process, the key decisions in the code and the repository’s figures. Figures and manifest come automatically from <code>main</code>.</p>'),
      s4: sh('04 · Blueprint', 'Six integrations, one blueprint', '<p>Streckenwacht came first. Structure, docs, tests and release process were tried out there and adopted by the others. If the pattern changes, all six follow.</p>'),
      s5: sh('05 · Workshop', 'A human decides, an agent builds', '<p>The integrations are built with Claude Code, an AI agent. It writes code, tests and docs. What gets built, what applies and what gets published is decided by the owner. The rules for this are public in every repository.</p>'),
      s6: sh('06 · Release path', 'How a new version reaches Home Assistant', '<p>No server in between: every HA instance fetches the release itself via the Marketplace (formerly HACS). The process is the same in all six repositories.</p>'),
      s7: sh('07 · Numbers', 'The repositories at a glance', '<p id="zahlen-stand"></p>'),
      s8: sh('08 · Contributions', 'Contributions to other projects', '<p>Bugs in source integrations that turn up while working on the integrations are reported or fixed there instead of worked around.</p>'),
      mapAria: 'Data sources, the six integrations and what appears in Home Assistant',
      legend: '<span><i></i>delivers data continuously</span><span><i class="opt"></i>only on request or for looking back</span><span><b></b>data packet, schematic</span>',
      tabsAria: 'Choose integration', stackAria: 'Layers of an integration',
      stack: [
        ['', 'Home Assistant', 'thin layer · HA imports only here', ['Config flow, UI only', 'Runtime: coordinator, listener or hourly tick', 'Entities', 'Actions', 'Repair issues', 'Diagnostics', 'de · en']],
        [' core', 'Core', 'pure Python · no HA imports', ['Data model', 'Calculation and booking', 'Rules with sources', 'Templates as data', 'Time grid in UTC', 'Meters: jumps, resets, outliers']],
        ['', 'Evidence', 'what the core relies on', ['Fixtures in the real format, with invented values', 'Core tests run everywhere', 'HA tests in GitHub Actions', 'oldest supported HA version in the test']]
      ].map(([cls, h, sub, bricks]) => `<div class="layer${cls}"><div><h3>${h}</h3><div class="sub">${sub}</div></div><div class="bricks">${bricks.map(b => `<span>${b}</span>`).join('')}</div></div>`).join(''),
      rules: [
        ['Dependencies', 'No third-party libraries', 'All six have empty <code>requirements</code>. Requests use HA’s client session, otherwise only the standard library. So an HA update can never get stuck on a library version.'],
        ['Time', 'UTC inside, days in local time', 'Calculations run in UTC, on a quarter-hour or hourly grid. Days and months start at midnight German time, so a DST changeover day has 92 or 100 quarter hours instead of 96.'],
        ['Write load', 'Spare the SD card', 'Never write on every meter reading. Data is saved at period boundaries, after quarter-hour ticks or once a day. Speicherwacht needs no file of its own at all.'],
        ['Formats', 'Never guess', 'The fixtures are the truth about a source’s format, with their origin in <code>_index.json</code>. A template derived only from someone else’s source code is labelled “experimental” in the README.'],
        ['Detection', 'Registry, not entity ID', 'Wärmewacht and Speicherwacht detect the source by platform and <code>unique_id</code>. Renamed entities don’t matter. Vendors differ only in templates; the core knows none.'],
        ['Errors', 'Never silently wrong', 'If a meter reports <code>unavailable</code> or a source fails, neither the integration nor HA is blocked. If a value is missing, the figure is <code>unknown</code>, never 0. A repair issue says why.']
      ].map(([l, h, p]) => `<div class="panel"><div class="label">${l}</div><h3>${h}</h3><p>${p}</p></div>`).join(''),
      ratioLabel: 'On record in the Git history',
      ratioP: 'Each of these commits carries the line <code>Co-Authored-By: Claude</code>. The owner stays responsible: pushes to <code>main</code>, releases, HACS submissions, issues and comments in other projects only go out once the owner says yes.',
      rulesLabel: 'The agent’s rules', codeAria: 'Excerpt from a CLAUDE.md', excerptDe: '· excerpt, original in German',
      loopAria: 'Workflow between human, agent and CI',
      loop: [
        ['gate', 'human', 'Human', 'Request', 'What should the integration do, and what not?'],
        ['', 'agent', 'Agent', 'Read', 'Rules, docs, fixtures, verified quirks of the source'],
        ['', 'agent', 'Agent', 'Build', 'Code, tests, docs, changelog on <code>dev</code>'],
        ['', 'ci', 'CI', 'Check', 'Tests, hassfest, HACS, older HA version'],
        ['gate', 'human', 'Human', 'Approve', 'See text and result, then yes or no'],
        ['', 'ci', 'GitHub', 'Ship', 'Release with ZIP, the Marketplace shows the update']
      ].map(([g, cls, who, b, s]) => `<div class="lp${g ? ' gate' : ''}"><span class="who ${cls}">${who}</span><b>${b}</b><span>${s}</span></div>`).join(''),
      termAria: 'Release process as a terminal', play: '▶ play',
      footer: 'No cookies, no tracking, no third-party requests. All values in the demos are invented.',
      cmdkAria: 'Command palette', cmdkPh: 'Search integration, section or action …', search: 'Search', hits: 'Results',
      cmdkFoot: '<span>↑ ↓ select</span><span>↵ open</span><span>Esc close</span>'
    },
    groups: {
      energie: { title: 'Energy', note: 'reads entities, calculates locally', sub: 'Heat, electricity, storage and feed-in in your own home. No network requests except SMARD.de on request.' },
      unterwegs: { title: 'On the move and informed', note: 'open data from the web', sub: 'Traffic and breaking news as triggers for automations.' }
    },
    content: {
      streckenwacht: {
        tagline: 'Watches over your route.', short: 'Roadworks, closures, traffic jams',
        q: 'Is anything closed, jammed or under construction on my way right now?',
        flow: [
          ['23 open data services', 'Autobahn GmbH nationwide, plus German states, cities and Luxembourg'],
          ['Fetch per source', 'One coordinator per source. If one fails, the others keep running'],
          ['Clip to the area', 'Circle on the map, chosen motorways and directions'],
          ['Merge duplicates', 'Same road, at most 300 m apart: one event'],
          ['In HA', 'Calendar, “disruption active”, travel delay, event, map points, own card'],
          ['What for', 'Push before you leave, night roadworks in the calendar']
        ],
        hood: [
          ['Provider pattern', 'Each source is a module under <code>providers/</code> and returns the same data model. Formats: REST/JSON, GeoJSON, WFS, ZIP with UTM coordinates, DATEX II.'],
          ['Areas as config subentries', 'One entry, any number of watch areas below it. Each source is queried once, each area filters locally.'],
          ['Narrow deduplication', 'Only roadworks and closures, same main road, matching period, at most 300 m. Can be switched off.'],
          ['Own dashboard card', 'Leaflet map shipped in the package, data via a WebSocket command. The card registers itself as a resource.'],
          ['Weekly source check', 'A workflow queries every source and checks that it still answers as expected.']
        ],
        not: '<b>Not every side street.</b> Bavaria, Hesse and North Rhine-Westphalia so far only have single cities; Thuringia, Bremen and Saarland only the motorways.',
        sig: 'Events in area'
      },
      eilwacht: {
        tagline: 'What matters makes itself heard.', short: 'Breaking and regional news',
        q: 'Is there breaking news, or something new from my state?',
        flow: [
          ['Public news API', 'Breaking news every minute, regional news every 15 minutes'],
          ['Detect what is new', 'Remembers what was already reported. After a restart, up to 6 hours are caught up'],
          ['Check keywords', 'Watchers per German state, optionally only for words like “Warnstreik” or “S-Bahn”'],
          ['In HA', 'Event, “breaking news active”, latest item, items in the last 24 hours'],
          ['What for', 'Push notification, announcement, light signal. Blueprints included']
        ],
        hood: [
          ['One coordinator per endpoint', 'Shared by all entries of the instance. At most 60 requests per hour, however many watchers run.'],
          ['Fallback without duplicates', 'If the breaking-news endpoint fails, the homepage feed steps in. Never both at once, because they link to different addresses.'],
          ['Seen items', 'A store remembers every item. After a restart, missed items up to 6 hours old are still reported, older ones learned silently.'],
          ['Keyword watcher', 'Respects word boundaries and umlauts, exclusion words possible. The demo checks the rules with a self-test.'],
          ['Rare writes', 'No <code>state_class</code> for counters that rarely change. So no long-term statistics nobody needs.']
        ],
        not: '<b>Not a news reader.</b> Only headline, first sentence and link, in German. No official warnings, use NINA and DWD for those. Not an ARD product.',
        sig: 'Breaking news active'
      },
      einspeisewacht: {
        tagline: 'Every quarter hour in view.', short: 'PV feed-in at negative prices',
        q: 'How much of my PV feed-in goes unpaid because of negative electricity prices?',
        flow: [
          ['Meter and price', 'Feed-in meter and day-ahead price sensor. SMARD.de only on request'],
          ['Spread over quarter hours', 'Each meter reading pro rata, each quarter hour with its price'],
          ['Determine the rule', 'Which version of § 51 EEG applies: from commissioning date, power and smart meter'],
          ['Book', 'Paid or unpaid, revenue and lost revenue. Survives restarts and meter resets'],
          ['In HA', '“Remuneration active”, calendar “Negative prices”, extension under § 51a, report'],
          ['What for', 'Charge the battery, start the wallbox or curtail when there is no remuneration']
        ],
        hood: [
          ['Booking core', 'Quarter-hour meter delta times that quarter hour’s price, without HA imports. “Negative” means below 0; exactly 0 is paid.'],
          ['Legal rules as building blocks', 'One block per commissioning period with the paragraphs in the code: every negative quarter hour (Solarspitzengesetz 2025), exceptions without smart meter and below 2 kW, older plants with hourly blocks.'],
          ['Shadow value', 'If a rule does not legally apply yet, “unpaid” stays at 0. A second value shows what would have been lost.'],
          ['SMARD.de only as opt-in', 'For negative quarter hours before setup and as a fallback when the price sensor is silent for over an hour. An error there never blocks booking.'],
          ['Report for any period', 'The “report” action also calculates backwards from long-term statistics.']
        ],
        not: '<b>Not a bill.</b> The values are a guide. What counts is what the grid operator measures with its meter.',
        sig: 'Exchange price, line: 0'
      },
      tarifwacht: {
        tagline: 'Every tariff. Every quarter hour.', short: 'Electricity tariffs compared',
        q: 'What would my electricity have cost with a different tariff?',
        flow: [
          ['Meter and prices', 'Grid consumption meter and price sensors. SMARD.de for looking back'],
          ['Record consumption per quarter hour', 'If the meter drops out, the gap is booked later'],
          ['Run every tariff', 'Fixed price, dynamic, Modul 3, standing charges, price changes from a date'],
          ['Compare', 'Difference to the current tariff and cheapest tariff so far'],
          ['In HA', 'Cost per tariff, savings from PV and battery with payback, own card, report also for the time before setup'],
          ['What for', 'Decide whether switching tariffs pays off']
        ],
        hood: [
          ['History, not sums', 'Consumption and every price seen are kept per quarter hour, 96 values a day. All tariffs are recalculated at startup, so a new tariff also applies retroactively.'],
          ['Tariffs as config subentries', 'Each tariff is a subentry. A change reloads the entry and recalculates the history.'],
          ['Modul 3 under § 14a EnWG', 'Time-variable grid fees with low and high rate per quarter, layered on top of an exchange-price or fixed-price tariff.'],
          ['Look back', 'Consumption from the hourly long-term statistics, exchange prices from SMARD.de, only on explicit action.'],
          ['Core from Einspeisewacht', 'Time grid, prices and meters come from its booking core, copied and independent since.']
        ],
        not: '<b>Same behaviour assumed.</b> Anyone with a dynamic tariff who shifts consumption to cheap hours saves more than the comparison shows.',
        sig: 'Exchange price, line: fixed'
      },
      waermewacht: {
        tagline: 'Every kilowatt-hour. Every cycle.', short: 'Health check for heat pumps',
        q: 'How efficient is my heat pump really?',
        flow: [
          ['What the heat pump provides', 'Entities from EMS-ESP, Bosch HomeCom or one of the beta templates'],
          ['Map', 'The template finds heat and power meters, compressor and operating mode by itself'],
          ['Detect runs', 'Compressor runs, defrosts and standby kept apart'],
          ['Calculate', 'Performance factor = total heat ÷ total electricity, per mode and period'],
          ['In HA', 'Performance factors, cycles, heating load, costs and gas comparison, health check'],
          ['What for', 'Notice when efficiency drops or the backup heater runs needlessly']
        ],
        hood: [
          ['Templates as data', 'Which entity is which signal, and what each state value means, lives in templates. EMS-ESP and Bosch HomeCom tested, beta templates for Luxtronik, Stiebel ISG, HeishaMon, Lambda, iDM, Viessmann, Mitsubishi Ecodan, Vaillant, Waterkotte and Daikin.'],
          ['Standby separated', 'Power drawn while the compressor stands still does not count towards the per-mode factor, but does towards the overall seasonal factor. Method as in the Fraunhofer ISE field test, system boundary named after SEPEMO.'],
          ['Look back from statistics', 'At setup, the current season is read from long-term statistics. Performance curve and health check compare periods with the same method.'],
          ['Analysis', 'Performance curve over outdoor temperature, heating load in W/K with heating limit, degree days, cycling per outdoor temperature.'],
          ['Gas mode', 'Separate entry type for gas boilers before switching: heating load from gas consumption.']
        ],
        not: '<b>Reads only, never controls.</b> A guide, not a professional diagnosis. The values are only as good as the heat pump’s meters.',
        sig: 'Compressor power'
      },
      speicherwacht: {
        tagline: 'Every charge. Every cycle.', short: 'Health check for home batteries',
        q: 'How well does my home battery work, and is it degrading?',
        flow: [
          ['Long-term statistics', 'Charge and discharge meters and state of charge, hour by hour'],
          ['Clean meters', 'Drops, resets and outliers removed'],
          ['Classify days', 'Operating days and idle days kept apart'],
          ['Calculate', 'Efficiency with state-of-charge correction, full cycles, idle loss, capacity'],
          ['In HA', 'Values per month, year and total, health check, report'],
          ['What for', 'Notice when the battery loses capacity or efficiency']
        ],
        hood: [
          ['Long-term statistics only', 'No storage file of its own, no state listeners for the calculation. Live and look-back calculate the same way, every hour from the hourly values.'],
          ['Meter reading, not change', 'The reading per hour is used. The meter module from Wärmewacht runs on top.'],
          ['Efficiency as a stated approximation', '(Discharge + ΔSoC × capacity) ÷ charge over the operating days. Named as such in README and docs.'],
          ['System boundary per entry', 'Battery (DC) or system (AC), as an attribute on the result, never mixed.'],
          ['Templates', 'Fronius tested, Huawei Solar, solarman and Anker SOLIX as beta.']
        ],
        not: '<b>Reads only, never controls.</b> The estimated capacity never replaces the value from setup. It only comes from discharges from full to empty.',
        sig: 'State of charge'
      }
    }
  };
})();
