# ViaMia-Keyboards
A VIA-compatible keyboards database.

## How do I add my keyboard?
To add your keyboard to ViaMia:
1. [Fork the keyboards repository](https://github.com/ViaMia/ViaMia-Keyboards/fork)
2. Check if your vendor is in the keyboards directory (if not, add it)
3. Check if your model is in the vendor directory (if not, add it)
4. Add your VIA compatible JSON file to the model directory (for different layouts, make sure the vidpid is different)
5. Create a pull request to this repository

When the PR is merged (and your VIA install is patched) your keyboard will load automatically when you open VIA.

## What's next
We're aware of some issues regarding vidpid uniqueness, especially when VIA starts merging keyboards that are already in the ViaMia repository. Fixing this is our top priority, as well as creating an overview of VIA vidpids (official and unofficial). An interactive tool will soon be available to choose the right VID & PID before you open a PR.
