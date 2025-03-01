# Obsidian Timelive Plugin

Plugin for [Obsidian](https://obsidian.md) that turns a list of dates into a timeline.

## Usage

The key difference from other timeline plugins is that Timelive doesn't use a code block. It's much easier to format any date event, provide a link or block of code, add an image or a video, etc.

To build a timeline, you need to define a list of dates, enclosed by the `|` symbol. The date format is automatically detected, but in case of ambiguity, the preferred format can be selected in the preferences. 

```
## Event title
- |2021-01-01| First event
- |2021-04-28| Second event
- |21 6 12| Third event
   It's also a valid date
- |now| Dynamic event, means that the timeline (e.g. your project) is **live**
```

See [info.md](info.md) for detailed examples.

![preview](https://github.com/aNNiMON/obsidian-timelive/blob/images/preview.png?raw=true)
