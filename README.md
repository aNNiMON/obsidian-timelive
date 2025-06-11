# Timelive Plugin

Plugin for [Obsidian](https://obsidian.md) that turns a list of dates into a
timeline.

## Usage

The key difference from other timeline plugins is that Timelive doesn't use a code block. It's much easier to format any date event, provide a link or block of code, add an image or a video, etc.

To build a timeline, you need to define a list of dates, enclosed by the `|` symbol. The date format is automatically detected, but in case of ambiguity, the preferred format can be selected in the preferences.

There is also support for time spans. Just define two dates separated by ` - ` and they will be turned into a span.

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

Use `now`, `today` or `present` to indicate that the project is live and that
today's marker should be added.

![preview](https://github.com/aNNiMON/obsidian-timelive/blob/images/preview.png?raw=true)

See [info.md](info.md) for a real use case.
