# Timelive Plugin

Plugin for [Obsidian](https://obsidian.md) that turns a list of dates into a timeline.

![timeline](../images/timeline.png?raw=true)

## Usage

The key difference from other timeline plugins is that Timelive doesn't use a code block. It's much easier to format any date event, provide a link or block of code, add an image or a video, etc.

To build a timeline, you need to define a list of dates, enclosed by the `|` symbol. The date format is automatically detected, but in case of ambiguity, the preferred format can be selected in the [preferences](#settings). You can also generate a placeholder with the **Timelive: New block** action (accessible from  <kbd>Ctrl+P</kbd> Command Palette).

There is also support for time spans. Just define two dates separated by ` - ` and they will be turned into a span.

The timeline will be rendered in Reading view, or in Live Editing mode in case you embed a note with a timeline.

Use `now`, `today` or `present` to indicate that the project is live and that today's marker should be added.

## Examples

````
## Demo
- |2011-02-05| Start
- |2021/04/28| Second event
- |21 6 12| Third event
   It's also a valid date
- |2018-07-01 - 2021-11-14| Time span
- |2025-02-05| **bold**, *italic*, ~~strikethrough~~, link to another note [[Welcome]]
- |2025-02-06| Merged events
  Test links and multiline code:
  https://github.com/aNNiMON/obsidian-timelive
   ```css
   .tlv-years {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    column-gap: 0.5rem;
    color: var(--text-normal);
   }
   ```
- |now| Dynamic event, means that the timeline (e.g. your project) is **live**
- |2056-05-24| Some future event
````

![preview](../images/preview.png?raw=true)

See [info.md](info.md) for a real use case.

## Settings

### Preview title date format

Date format for titles in the date preview popup. See [Date format reference](https://momentjs.com/docs/#/displaying/format/).

**Examples:**

| Value        | Default? | Result |
| ------------ |:--------:| ------ |
| `YYYY-MM-DD` | ✅ | ![YYYY-MM-DD](../images/format-title-1.png?raw=true) |
| `MM/DD/YYYY` | | ![MM/DD/YYYY](../images/format-title-2.png?raw=true) |
| `MMMM DD, YYYY` | | ![MMMM DD, YYYY](../images/format-title-3.png?raw=true) |
| `DD MMM YYYY` | | ![DD MMM YYYY](../images/format-title-4.png?raw=true) |
| `ddd, DD MMM YYYY` | | ![ddd, DD MMM YYYY](../images/format-title-5.png?raw=true) |

### Calendar month format

Calendar row format for years and months only. See [Date format reference](https://momentjs.com/docs/#/displaying/format/).

**Examples:**

| Value | Default? | Result |
| ----- |:--------:| ------ |
| `YYYY-MM` | ✅ | ![YYYY-MM](../images/format-month-1.png?raw=true) |
| `YYYY/MM` | | ![YYYY/MM](../images/format-month-2.png?raw=true) |
| `MMM YY` | | ![MMM YY](../images/format-month-3.png?raw=true) |
| `MMM YYYY` | | ![MMM YYYY](../images/format-month-4.png?raw=true) |

### Parse date format

| Value | Default? | Matches |
| ----- |:--------:| ------ |
| `Years Months Days` | ✅ | 2008-02-09, 2008/02/09, 08/2/9, 2008/02-09, 8 2 9 |
| `Days Months Years` |    | 09-02-2008, 09/02/2008, 9/2/08, 09-02/2008, 9 2 8 |
| `Months Days Years` |    | 02-09-2008, 02/09/2008, 2/9/08, 02-09/2008, 2 9 8 |
