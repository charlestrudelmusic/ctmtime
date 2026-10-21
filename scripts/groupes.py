# Crée une copie de l'app par groupe (joliette/, mv/) à partir de index.html.
# Chaque groupe a sa propre adresse : une app installée depuis …/ctmtime/joliette/
# se rouvre toujours là, donc elle sait toujours quel est son groupe.
# À relancer après CHAQUE modification de index.html :  python3 scripts/groupes.py
import json, os, sys
ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GROUPES = ['joliette', 'mv']

src = open(os.path.join(ICI, 'index.html'), encoding='utf-8').read()
man = json.load(open(os.path.join(ICI, 'manifest.webmanifest'), encoding='utf-8'))

def remplacer(s, a, b, n):
    assert s.count(a) == n, f'« {a} » trouvé {s.count(a)} fois au lieu de {n}'
    return s.replace(a, b)

for g in GROUPES:
    d = os.path.join(ICI, g); os.makedirs(d, exist_ok=True)
    s = remplacer(src, 'data-groupe=""', f'data-groupe="{g}"', 1)
    s = remplacer(s, '"icones/', '"../icones/', 4)
    s = remplacer(s, "register('sw.js')", "register('../sw.js', { scope: '../' })", 1)
    s = '<!-- FICHIER GÉNÉRÉ par scripts/groupes.py : ne pas modifier, modifier ../index.html -->\n' + s
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(s)
    m = dict(man, start_url='./', scope='./',
             icons=[dict(i, src='../' + i['src']) for i in man['icons']])
    json.dump(m, open(os.path.join(d, 'manifest.webmanifest'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('ok', g)
