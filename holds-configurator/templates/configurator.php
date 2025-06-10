<div id="holds-canvas-container">
    <div style="margin-bottom:10px;">
        <label for="preset">Bibliothèque de formes :</label>
        <select id="preset">
            <option value="">— Choisir une forme prédéfinie —</option>
            <option value="ball">Boule / Macro sphère</option>
            <option value="sloper">Sloper (plat bombé)</option>
            <option value="edge">Edge (règle)</option>
            <option value="crimp">Crimp (arête fine)</option>
            <option value="pinch">Pinch (pince)</option>
            <option value="jug">Jug (bac)</option>
            <option value="miniJug">Mini-jug</option>
            <option value="pocket">Pocket (trou)</option>
            <option value="blob">Blob (galet mutant)</option>
            <option value="hoof">Hoof (sabot)</option>
        </select>
    </div>
    <canvas id="holds-canvas" style="width: 100%; height: 400px; display: block; background: #fff"></canvas>
    <div style="margin-top:16px;">
        <label for="shape">Forme :</label>
        <select id="shape">
            <option value="cube">Cube</option>
            <option value="sphere">Sphère</option>
            <option value="cylinder">Cylindre</option>
            <option value="cone">Cône</option>
            <option value="pyramid">Pyramide</option>
            <option value="prism">Prisme triangulaire</option>
            <option value="galet">Galet</option>
        </select>
        <span id="param-controls"></span>
    </div>
    <div style="margin-top:8px;">
        <label style="display:inline-block;"><input type="checkbox" id="pocket" style="vertical-align:middle;"> Mode trou / pocket</label>
        <button id="mode-libre-btn" type="button" style="margin-left:12px;">Mode libre</button>
        <span id="mode-libre-label" style="font-size:0.9em;color:#2194ce;display:none;">(Glisser un sommet rouge)</span>
    </div>
    <div style="margin-top:12px;">
        <label for="rugosite">Rugosité :</label>
        <input type="range" id="rugosite" min="0" max="2" value="0" step="0.01" style="width:150px;">
        <span id="rugosite-value">0</span>
        <button id="flatten-btn" type="button" style="margin-left:18px;">Aplatir la base</button>
    </div>
    <div style="margin-top:18px;">
        <button id="export-btn">Exporter STL</button>
    </div>
    <p style="margin-top:10px;font-size:0.92em;color:#888;">Astuce : Utilise la bibliothèque, règle les paramètres, active la rugosité ou mode libre, puis clique sur “Aplatir la base” si besoin.</p>
</div>
