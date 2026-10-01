Title: Local only: where your scans go when nothing is uploaded

Dek: The interface is served from localhost and the render runs on the local GPU, so files never travel - and the limits of that arrangement deserve as much space as the benefit.

## Where the file actually is

Drag a photograph onto the asset rail and it is registered by path; the file stays where it is. The browser window you are looking at is served from a loopback address, which is why the requirements list a current Edge or Chrome - the browser is the delivery mechanism for the interface, not part of the processing. When you start a job, the Visual Enhancer runtime renders on the GPU and the result is written to the output directory you selected.

There is no account, no upload control, no cloud tier and no trial that ships your file somewhere to be processed. That is not a feature that has been hidden behind a menu. It does not exist.

## Why the internet is not in the loop

The render is local, and the requirements say so plainly: Windows 10 (1909 or later, 64-bit) or Windows 11, an NVIDIA RTX card, 8 GB of RAM minimum with 16 GB recommended for 1080p and 4K video, roughly 3 GB of free disk - the portable folder is about 1.1 GB unzipped - and a current browser. No line in that list is a network service.

The practical consequence is that the material you would least want to send somewhere is the material this suits best. Documents, family photographs, client work under an agreement, archival scans: files where the processing is fine but the trip is not. The published examples happen to be public-domain files, because those are the only ones that can be shown; the jobs themselves look like a personal archive. An 1880 newspaper scan at 1280×1803 came out at 5120×7216 in 32.4 s. A 900×1142 glass-plate portrait went to 1800×2284 in 7.4 s, a 6.7 MiB PNG. Both are the shapes of work an archive generates by the thousand, and the queue is built for exactly that - per-item progress, elapsed time, cancellable and re-runnable.

## What local does not buy you

Local means the file does not move. It does not mean the tool is certified for anything, and it is worth being precise about the difference. The processing still consumes your machine: disk for the outputs, memory for video, and time. The measured figure for video is 2.43 s per frame on a GeForce RTX 4090 - a three-second 720p clip took 87.4 s - so a long clip is an afternoon, not a coffee break. The queue makes that unattended, not shorter.

For that same run there is a second honest caveat. The Video to 4K preset describes H.265 with hardware NVENC inside an MKV container, but the test machine ran driver 591.86, below the 610 needed for hardware NVENC, so the encoder fell back to software and the output was an H.264 MP4. That is a driver condition, and it is the kind of thing that only shows up after you have run the job.

## The limits, plainly

This is Windows and NVIDIA RTX only. No macOS build, no AMD, no Intel. There is no public download: the build is handed out on request, the bundled runtime includes parts that are not in the public SDK, and the author treats it as an internal and technical preview rather than a product. There is no code signing either, so SmartScreen would warn if it ever shipped publicly. The English build still shows a handful of untranslated strings. And it is an independent third-party project, not affiliated with NVIDIA.

If local processing is the part that matters to you, those limits are the price of it, and they should be read before the screenshots rather than after. The request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download) if you want to ask whether your machine fits.

Suggested channel: Dev.to
Images: reddit/ui/en-04-oldphoto-compare.jpg, reddit/05-text4x-compare.jpg, reddit/ui/en-08-queue-running.jpg
