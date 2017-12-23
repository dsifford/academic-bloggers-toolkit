<?php

$finder = PhpCsFixer\Finder::create()
    ->exclude('css')
    ->exclude('js')
    ->exclude('languages')
    ->exclude('vendor')
    ->in(__DIR__ . '/src')
;

return PhpCsFixer\Config::create()
    ->setHideProgress(false)
    ->setLineEnding("\n")
    ->setRiskyAllowed(true)
    ->setFinder($finder)
;
