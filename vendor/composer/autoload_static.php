<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit852f97df302db334dd785387953fb702
{
    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInit852f97df302db334dd785387953fb702::$classMap;

        }, null, ClassLoader::class);
    }
}
