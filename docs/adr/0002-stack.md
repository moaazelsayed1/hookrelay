# 1. Record architecture decisions

Date: 2026-07-29

## Status

Accepted

## Context

We need to build Hookrelay in a well-known stack for the developers and that is well documented so we depend the most on reading the docs besides consulting AI. The main developer of the system (me) is most experienced with JS/TS and built a large project with NestJS. we need a strict type safety.

## Decision
We will use NestJs/Typescript for the most of our system and this decision should be revisited in the future at the 5th phase in which we will exercise some Go programming in rewriting of the delivery worker.