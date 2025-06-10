<div id="holds-canvas-container">
    <div style="margin-bottom:10px;">
        <label for="preset"><?php _e('Bibliothèque de formes :', 'holds-configurator'); ?></label>
        <select id="preset">
            <option value=""><?php _e('— Choisir une forme prédéfinie —', 'holds-configurator'); ?></option>
            <option value="ball"><?php _e('Boule / Macro sphère', 'holds-configurator'); ?></option>
            <option value="sloper"><?php _e('Sloper (plat bombé)', 'holds-configurator'); ?></option>
            <option value="edge"><?php _e('Edge (règle)', 'holds-configurator'); ?></option>
            <option value="crimp"><?php _e('Crimp (arête fine)', 'holds-configurator'); ?></option>
            <option value="pinch"><?php _e('Pinch (pince)', 'holds-configurator'); ?></option>
            <option value="jug"><?php _e('Jug (bac)', 'holds-configurator'); ?></option>
            <option value="miniJug"><?php _e('Mini-jug', 'holds-configurator'); ?></option>
            <option value="pocket"><?php _e('Pocket (trou)', 'holds-configurator'); ?></option>
            <option value="blob"><?php _e('Blob (galet mutant)', 'holds-configurator'); ?></option>
            <option value="hoof"><?php _e('Hoof (sabot)', 'holds-configurator'); ?></option>
        </select>
    </div>
    <canvas id="holds-canvas" style="width: 100%; height: 400px; display: block; background: #fff"></canvas>
    <div style="margin-top:16px;">
        <label for="shape"><?php _e('Forme :', 'holds-configurator'); ?></label>
        <select id="shape">
            <option value="cube"><?php _e('Cube', 'holds-configurator'); ?></option>
            <option value="sphere"><?php _e('Sphère', 'holds-configurator'); ?></option>
            <option value="cylinder"><?php _e('Cylindre', 'holds-configurator'); ?></option>
            <option value="cone"><?php _e('Cône', 'holds-configurator'); ?></option>
            <option value="pyramid"><?php _e('Pyramide', 'holds-configurator'); ?></option>
            <option value="prism"><?php _e('Prisme triangulaire', 'holds-configurator'); ?></option>
            <option value="galet"><?php _e('Galet', 'holds-configurator'); ?></option>
        </select>
        <span id="param-controls"></span>
    </div>
    <div style="margin-top:8px;">
        <label style="display:inline-block;"><input type="checkbox" id="pocket" style="vertical-align:middle;"> <?php _e('Mode trou / pocket', 'holds-configurator'); ?></label>
        <button id="mode-libre-btn" type="button" style="margin-left:12px;"><?php _e('Mode libre', 'holds-configurator'); ?></button>
        <span id="mode-libre-label" style="font-size:0.9em;color:#2194ce;display:none;"><?php _e('(Glisser un sommet rouge)', 'holds-configurator'); ?></span>
    </div>
    <div style="margin-top:12px;">
        <label for="rugosite"><?php _e('Rugosité :', 'holds-configurator'); ?></label>
        <input type="range" id="rugosite" min="0" max="2" value="0" step="0.01" style="width:150px;">
        <span id="rugosite-value">0</span>
        <button id="flatten-btn" type="button" style="margin-left:18px;"><?php _e('Aplatir la base', 'holds-configurator'); ?></button>
    </div>
    <div style="margin-top:18px;">
        <button id="export-btn"><?php _e('Exporter STL', 'holds-configurator'); ?></button>
    </div>
    <p style="margin-top:10px;font-size:0.92em;color:#888;">
        <?php _e('Astuce : Utilise la bibliothèque, règle les paramètres, active la rugosité ou mode libre, puis clique sur “Aplatir la base” si besoin.', 'holds-configurator'); ?>
    </p>
</div>
