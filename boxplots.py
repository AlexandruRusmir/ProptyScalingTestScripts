import matplotlib.pyplot as plt
import json

PROPERTY_LAUNCH_RESULTS_FILE_PATH = './results.json'
PROPERTY_VALIDATION_RESULTS_FILE_PATH = './propertyValidationResults.json'

current_file_path = PROPERTY_LAUNCH_RESULTS_FILE_PATH
with open(current_file_path, 'r') as f:
    data = json.load(f)

fields = list(data[0].keys())
box_data = [[entry[field] for entry in data] for field in fields]

fig, axs = plt.subplots(len(fields), 1, figsize=(10, len(fields)*6))

plt.style.use('seaborn-darkgrid')

field_mapping = {
    'spentEther': 'Ether cheltuit',
    'averageBlockTime': 'Timpul mediu de minare a unui bloc',
    'responseTime': 'Timpul de procesare a tranzacției',
    'blockSize': 'Dimensiunea blocului'
}

unit_mapping = {
    'spentEther': '(ETH)',
    'averageBlockTime': '(secunde)',
    'responseTime': '(secunde)',
    'blockSize': '(octeți)'
}

xlim_mapping = {
    'spentEther': (0.0021, 0.00217),
    'blockSize': (10190, 10194)
} if current_file_path == PROPERTY_LAUNCH_RESULTS_FILE_PATH else {
    'spentEther': (0.000085, 0.000086),
    'blockSize': (63040, 63048)
}

for i, field in enumerate(fields):
    bplot = axs[i].boxplot(box_data[i], vert=False, patch_artist=True, notch=True, 
                           flierprops=dict(marker='o', markerfacecolor='gray', markersize=5, linestyle='none'), 
                           medianprops=dict(linewidth=2))

    bplot['boxes'][0].set_facecolor('lightblue')
    bplot['boxes'][0].set_edgecolor('gray')
    axs[i].set_title(field_mapping[field], fontsize=20)
    axs[i].ticklabel_format(style='plain', axis='x', useOffset=False)
    axs[i].set_xlabel(unit_mapping[field], fontsize=15)
    axs[i].tick_params(axis='both', labelsize=12)
    axs[i].grid(True, linestyle='-', which='major', color='lightgrey', alpha=0.5)
    axs[i].set_yticklabels([])
    
    if field in xlim_mapping:
        axs[i].set_xlim(xlim_mapping[field])

plt.tight_layout(h_pad=20.0, pad=9.0)
plt.show()
