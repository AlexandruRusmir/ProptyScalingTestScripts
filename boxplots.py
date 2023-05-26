import matplotlib.pyplot as plt
import json

with open('./propertyValidationResults.json', 'r') as f:
    data = json.load(f)

fields = list(data[0].keys())
box_data = [[entry[field] for entry in data] for field in fields]

fig, axs = plt.subplots(len(fields), 1, figsize=(10, len(fields)*6))

plt.style.use('seaborn-darkgrid')
plt.rcParams.update({'axes.titlesize': 'large'})

field_mapping = {
    'spentEther': 'Ether cheltuit',
    'averageBlockTime': 'Timpul mediu de minare a unui bloc',
    'responseTime': 'Timpul de procesare a tranzacției',
    'blockSize': 'Dimensiunea blocului'
}

for i, field in enumerate(fields):
    axs[i].boxplot(box_data[i], vert=False, patch_artist=True, notch=True, medianprops={'linewidth': 2})
    axs[i].set_yticklabels([field_mapping[field]], fontsize=14)
    axs[i].ticklabel_format(style='plain', axis='x', useOffset=False)

plt.tight_layout(h_pad=7.0, pad=4.0)
plt.show()